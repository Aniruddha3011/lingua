"""
Free AI providers for the language teacher agent.

- STT  : Groq Whisper (free tier, no credit card)
- LLM  : Groq LLaMA-3 (free tier, no credit card)
- TTS  : edge-tts  (Microsoft Edge, completely free, no key needed)

Sign up at https://console.groq.com — free tier gives plenty of tokens
for a language-learning app.
"""

from __future__ import annotations

import asyncio
import io
import logging
import struct
import tempfile
import os
from typing import AsyncIterator, Iterator, List, Optional, Union

import numpy as np
import edge_tts
from groq import AsyncGroq
from getstream.video.rtc.track_util import PcmData, AudioFormat
from vision_agents.core.stt.stt import STT, TranscriptResponse
from vision_agents.core.tts.tts import TTS
from vision_agents.core.edge.types import Participant
from vision_agents.core.instructions import Instructions
from vision_agents.core.llm.llm import (
    LLM,
    LLMResponseDelta,
    LLMResponseFinal,
)
from vision_agents.core.utils.stream import Stream

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _mp3_to_pcm_s16(mp3_bytes: bytes, target_rate: int = 48_000, gain: float = 3.5) -> np.ndarray:
    """Convert MP3 bytes → int16 numpy array at target_rate using PyAV with audio gain boost."""
    try:
        import av
        container = av.open(io.BytesIO(mp3_bytes), format="mp3")
        resampler = av.AudioResampler(format="s16", layout="mono", rate=target_rate)
        pcm_chunks = []
        for frame in container.decode(audio=0):
            for r_frame in resampler.resample(frame):
                pcm_chunks.append(r_frame.to_ndarray())
        if not pcm_chunks:
            return np.zeros(0, dtype=np.int16)
        samples = np.concatenate(pcm_chunks, axis=1).flatten()
        if gain != 1.0:
            boosted = samples.astype(np.float32) * gain
            samples = np.clip(boosted, -32768, 32767).astype(np.int16)
        return samples
    except Exception as exc:
        logger.warning("_mp3_to_pcm_s16 PyAV error: %s", exc)
        return np.frombuffer(mp3_bytes, dtype=np.int16)


def _pcm_to_wav(samples: np.ndarray, sample_rate: int) -> bytes:
    """Wrap int16 numpy array in a minimal WAV container for Whisper upload."""
    n_samples = len(samples)
    data_bytes = samples.astype(np.int16).tobytes()
    # WAV header
    header = struct.pack(
        "<4sI4s4sIHHIIHH4sI",
        b"RIFF",
        36 + len(data_bytes),
        b"WAVE",
        b"fmt ",
        16,         # chunk size
        1,          # PCM
        1,          # mono
        sample_rate,
        sample_rate * 2,  # byte rate
        2,          # block align
        16,         # bits per sample
        b"data",
        len(data_bytes),
    )
    return header + data_bytes


AGENT_SPEAKING_UNTIL: float = 0.0

# ---------------------------------------------------------------------------
# STT — Groq Whisper
# ---------------------------------------------------------------------------

class GroqSTT(STT):
    """
    Batch STT using Groq's hosted Whisper model.
    Accumulates audio chunks and transcribes when speech is completed.
    Includes echo cancellation guard and Whisper prompt biasing.
    """

    SAMPLE_RATE = 16_000          # Whisper expects 16 kHz
    SILENCE_THRESHOLD = 900       # RMS threshold for real human voice
    SILENCE_FRAMES_NEEDED = 30    # ~600ms of true silence before segmenting
    MIN_AUDIO_FRAMES = 20         # ~400ms minimum speech frames

    # Common Whisper hallucinations on ambient noise/silence
    HALLUCINATIONS = {
        "thank you.", "thank you", "thanks for watching.", "thanks for watching",
        "thank you very much.", "thank you very much", "bye.", "bye", "you",
        "subtitles by the amara.org community", "subscribe", "please subscribe",
        "goodbye.", "goodbye", "yeah.", "okay.", "it.", "and", "that"
    }

    def __init__(self, api_key: str, model: str = "whisper-large-v3-turbo"):
        super().__init__(provider_name="groq-whisper")
        self._client = AsyncGroq(api_key=api_key)
        self.model = model
        self._buffer: List[np.ndarray] = []
        self._silence_count = 0
        self._speaking = False
        self._last_emitted_text = ""
        self._last_emitted_time = 0.0
        self._caption_callback = None

    def set_caption_callback(self, callback):
        """Set an async callback to broadcast realtime student captions."""
        self._caption_callback = callback

    async def process_audio(self, pcm_data: PcmData, participant: Participant):
        try:
            # Echo suppression: ignore microphone input while Luna is actively speaking
            now = asyncio.get_event_loop().time()
            if now < AGENT_SPEAKING_UNTIL:
                self._buffer.clear()
                self._speaking = False
                self._silence_count = 0
                return

            # Resample if needed (the SDK delivers 48 kHz)
            samples = pcm_data.samples.flatten().astype(np.float32)
            if pcm_data.sample_rate != self.SAMPLE_RATE:
                ratio = self.SAMPLE_RATE / pcm_data.sample_rate
                new_len = int(len(samples) * ratio)
                samples = np.interp(
                    np.linspace(0, len(samples) - 1, new_len),
                    np.arange(len(samples)),
                    samples,
                )

            samples_i16 = np.clip(samples, -32768, 32767).astype(np.int16)
            rms = float(np.sqrt(np.mean(samples_i16.astype(np.float32) ** 2)))

            if rms > self.SILENCE_THRESHOLD:
                self._speaking = True
                self._silence_count = 0
                self._buffer.append(samples_i16)
            elif self._speaking:
                self._silence_count += 1
                self._buffer.append(samples_i16)
                if self._silence_count >= self.SILENCE_FRAMES_NEEDED:
                    await self._flush(participant)
        except Exception as exc:
            logger.warning("GroqSTT.process_audio error: %s", exc)

    async def _flush(self, participant: Participant):
        if len(self._buffer) < self.MIN_AUDIO_FRAMES:
            self._buffer.clear()
            self._speaking = False
            self._silence_count = 0
            return

        audio = np.concatenate(self._buffer)
        self._buffer.clear()
        self._speaking = False
        self._silence_count = 0

        try:
            wav_bytes = _pcm_to_wav(audio, self.SAMPLE_RATE)
            transcription = await self._client.audio.transcriptions.create(
                file=("audio.wav", wav_bytes, "audio/wav"),
                model=self.model,
                response_format="text",
                prompt="Language learning practice: English and Spanish phrases, Un café, Por favor, Hola, Gracias, De nada",
                temperature=0.0,
            )
            text = str(transcription).strip()

            clean = text.lower().strip().strip(".")
            if not clean or clean in self.HALLUCINATIONS or text.lower() in self.HALLUCINATIONS:
                return

            now = asyncio.get_event_loop().time()
            if text == self._last_emitted_text and (now - self._last_emitted_time) < 2.0:
                return

            self._last_emitted_text = text
            self._last_emitted_time = now

            logger.info("🎤 Student said: %s", text)

            if self._caption_callback:
                try:
                    user_id = getattr(participant, "user_id", "student") if participant else "student"
                    asyncio.create_task(
                        self._caption_callback(
                            speaker_id=user_id,
                            speaker_name="You",
                            text=text,
                            role="student",
                        )
                    )
                except Exception as exc:
                    logger.warning("GroqSTT caption callback error: %s", exc)

            self._emit_transcript_event(
                text=text,
                participant=participant,
                response=TranscriptResponse(model_name=self.model),
                mode="final",
            )
        except Exception as exc:
            logger.warning("GroqSTT transcription error: %s", exc)


# ---------------------------------------------------------------------------
# LLM — Groq LLaMA
# ---------------------------------------------------------------------------

class GroqLLM(LLM):
    """
    Streaming text LLM using Groq API.
    Supports auto-discovery and fallback across available Groq chat models.
    """

    DEFAULT_MODELS = [
        "qwen/qwen3.8-27b",
        "openai/gpt-oss-120b",
        "openai/gpt-oss-20b",
        "llama-3.3-70b-versatile",
        "llama-3.1-8b-instant",
    ]

    def __init__(
        self,
        api_key: str,
        model: str | None = None,
        system_prompt: str = "",
    ):
        super().__init__()
        self.provider_name = "groq-llama"
        self._client = AsyncGroq(api_key=api_key)
        self.model = model or os.getenv("GROQ_LLM_MODEL") or "qwen/qwen3.8-27b"
        self._system_prompt = system_prompt
        self._history: list = []

    def set_instructions(self, instructions: Instructions | str) -> None:
        """Keep Groq's system prompt in sync with the active lesson context."""
        super().set_instructions(instructions)
        self._system_prompt = (
            instructions
            if isinstance(instructions, str)
            else instructions.full_reference
        )

    async def _resolve_working_model(self) -> str:
        """Discover an active chat model from the user's Groq account."""
        try:
            model_list = await self._client.models.list()
            available_ids = [m.id for m in model_list.data]
            logger.info("Available Groq models on account: %s", available_ids)

            for candidate in self.DEFAULT_MODELS:
                if candidate in available_ids:
                    return candidate

            # Find any chat model
            for m_id in available_ids:
                if not any(x in m_id.lower() for x in ("guard", "whisper", "orpheus", "vision")):
                    return m_id

            return available_ids[0] if available_ids else "qwen/qwen3.8-27b"
        except Exception as exc:
            logger.warning("Could not list Groq models: %s", exc)
            return "qwen/qwen3.8-27b"

    async def simple_response(
        self,
        text: str,
        participant: Optional[Participant] = None,
    ) -> AsyncIterator[LLMResponseDelta | LLMResponseFinal]:
        """Stream a response for the prompt/text using Groq API with clean history."""
        # Sanitize history: keep only valid full turns
        clean_history = []
        for m in self._history[-14:]:
            content = m.get("content", "").strip()
            if len(content) > 3 and not content.lower() in ("spot", "that", "you", "let", "yeah"):
                clean_history.append(m)

        messages = []
        if self._system_prompt:
            messages.append({"role": "system", "content": self._system_prompt})
        messages.extend(clean_history)
        messages.append({"role": "user", "content": text})

        for attempt in range(2):
            try:
                full_text = ""
                item_id = f"groq-{len(self._history)}"
                stream = await self._client.chat.completions.create(
                    model=self.model,
                    messages=messages,
                    stream=True,
                    max_tokens=150,
                    temperature=0.7,
                )
                async for chunk in stream:
                    delta = chunk.choices[0].delta.content or ""
                    if delta:
                        full_text += delta
                        yield LLMResponseDelta(
                            item_id=item_id,
                            delta=delta,
                            content_index=0,
                        )

                if len(full_text.strip()) > 3:
                    self._history.append({"role": "user", "content": text})
                    self._history.append({"role": "assistant", "content": full_text.strip()})
                yield LLMResponseFinal(item_id=item_id, text=full_text)
                return
            except Exception as exc:
                err_str = str(exc)
                if "model_not_found" in err_str or "404" in err_str or "does not exist" in err_str:
                    logger.warning("Model '%s' not found on Groq. Finding working model...", self.model)
                    new_model = await self._resolve_working_model()
                    if new_model != self.model:
                        logger.info("Switching GroqLLM model to '%s'", new_model)
                        self.model = new_model
                        continue
                logger.error("GroqLLM.simple_response error: %s", exc)
                break

    async def respond(
        self,
        transcript: str,
        output: Stream,
        *,
        participant=None,
    ):
        """Stream a response for the given user transcript."""
        async for item in self.simple_response(transcript, participant=participant):
            await output.send(item)


# ---------------------------------------------------------------------------
# TTS — edge-tts (Microsoft Edge, completely free)
# ---------------------------------------------------------------------------

class EdgeTTS(TTS):
    """
    TTS using Microsoft Edge's neural voices via the edge-tts package.
    Completely free — no API key, no account needed.
    """

    SAMPLE_RATE = 48_000

    def __init__(self, voice: str = "en-US-JennyNeural"):
        super().__init__(provider_name="edge-tts")
        self._voice = voice
        self.streaming = False  # we return a full PcmData per utterance
        self._caption_callback = None

    def set_caption_callback(self, callback):
        """Set an async callback to broadcast realtime teacher captions."""
        self._caption_callback = callback

    async def stream_audio(
        self, text: str, *args, **kwargs
    ) -> PcmData:
        global AGENT_SPEAKING_UNTIL
        clean_text = text.strip() if text else ""
        if clean_text and self._caption_callback:
            try:
                asyncio.create_task(
                    self._caption_callback(
                        speaker_id="ai-language-teacher",
                        speaker_name="Luna",
                        text=clean_text,
                        role="teacher",
                    )
                )
            except Exception as exc:
                logger.warning("EdgeTTS caption callback error: %s", exc)

        communicate = edge_tts.Communicate(text, self._voice, volume="+100%")

        mp3_chunks: list[bytes] = []
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                mp3_chunks.append(chunk["data"])

        if not mp3_chunks:
            # Return silence on empty output
            silence = np.zeros(self.SAMPLE_RATE // 10, dtype=np.int16)
            return PcmData(
                samples=silence,
                sample_rate=self.SAMPLE_RATE,
                format=AudioFormat.S16,
            )

        mp3_bytes = b"".join(mp3_chunks)
        samples = _mp3_to_pcm_s16(mp3_bytes, self.SAMPLE_RATE)
        
        # Guard microphone input during playback duration
        duration = len(samples) / float(self.SAMPLE_RATE)
        AGENT_SPEAKING_UNTIL = asyncio.get_event_loop().time() + duration + 0.6

        return PcmData(
            samples=samples,
            sample_rate=self.SAMPLE_RATE,
            format=AudioFormat.S16,
        )

    async def stop_audio(self) -> None:
        pass  # stateless — nothing to stop
