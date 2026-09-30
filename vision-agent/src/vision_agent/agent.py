"""
Luna — AI Language Teacher Agent
=================================
Voice-only AI teacher using:
  - OpenAI Realtime API (GPT-4o Realtime) as the LLM
  - Stream Edge (getstream.io) as the WebRTC transport

The teacher always speaks English and teaches the selected language
through English. No video — audio only.

Usage:
  python -m vision_agent run        # join a new call (opens demo UI)
  python -m vision_agent serve      # start HTTP server for call webhooks
"""

import logging
import os
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from vision_agents.core import Agent, AgentLauncher, Runner, ServeOptions, User
from vision_agents.core.instructions import Instructions
from vision_agents.plugins.getstream import Edge
from vision_agents.plugins.openai import Realtime

# ── Environment ───────────────────────────────────────────────────────────────
_HERE = Path(__file__).parent          # src/vision_agent/
_VISION_AGENT_ROOT = _HERE.parent.parent   # vision-agent/
_REPO_ROOT = _VISION_AGENT_ROOT.parent    # DualingoApp/

load_dotenv(_VISION_AGENT_ROOT / ".env")            # vision-agent/.env  (takes priority)
load_dotenv(_REPO_ROOT / ".env", override=False)    # DualingoApp/.env   (fallback)

logger = logging.getLogger(__name__)

# ── Constants ─────────────────────────────────────────────────────────────────
AGENT_USER_ID = os.getenv("AGENT_USER_ID", "ai-language-teacher")
AGENT_NAME = os.getenv("AGENT_NAME", "Luna")


# Read the teacher base instructions from file at import time.
_INSTRUCTIONS_FILE = _VISION_AGENT_ROOT / "instructions.md"


def _load_base_instructions() -> str:
    """Read instructions.md and return its content as a string."""
    if _INSTRUCTIONS_FILE.exists():
        return _INSTRUCTIONS_FILE.read_text(encoding="utf-8")
    # Inline fallback
    return (
        "You are Luna, a warm and encouraging AI language teacher. "
        "Always speak English and teach the target language through English. "
        "Keep your replies short and do not use special characters."
    )


BASE_INSTRUCTIONS = _load_base_instructions()


def _build_instructions(custom_data: dict[str, Any]) -> str:
    """
    Combine the base teacher instructions with the lesson context
    extracted from the Stream call's custom_data field.
    """
    language_name = custom_data.get("language_name") or "the target language"
    lesson_title = custom_data.get("lesson_title") or "General Conversation"
    goals: list[dict] = custom_data.get("goals") or []
    vocabulary: list[dict] = custom_data.get("vocabulary") or []
    phrases: list[dict] = custom_data.get("phrases") or []
    ai_teacher_prompt: str | None = custom_data.get("ai_teacher_prompt")

    sections = [BASE_INSTRUCTIONS, ""]

    # ── Lesson context injected at runtime ──────────────────────────────────
    sections.append(f"## Current Lesson Focus\n")
    sections.append(f"- **Target Language:** {language_name}")
    sections.append(f"- **Lesson Title:** {lesson_title}")

    if goals:
        sections.append("\n**Lesson Goals:**")
        for g in goals:
            sections.append(f"  - {g.get('description', '')}")

    if vocabulary:
        sections.append("\n**Target Vocabulary for this Session:**")
        for v in vocabulary:
            word = v.get("word", "")
            translation = v.get("translation", "")
            phonetic = v.get("phonetic", "")
            line = f"  - {word} → {translation}"
            if phonetic:
                line += f" (/{phonetic}/)"
            sections.append(line)

    if phrases:
        sections.append("\n**Key Phrases for this Session:**")
        for p in phrases:
            text = p.get("text", "")
            translation = p.get("translation", "")
            sections.append(f"  - \"{text}\" → \"{translation}\"")

    if ai_teacher_prompt:
        sections.append(f"\n**Teacher Personality & Context Note:** {ai_teacher_prompt}")

    sections.append(
        f"\n### Strict Spoken Execution Rules:\n"
        f"1. You are teaching ONLY {language_name} for the lesson '{lesson_title}'. Do NOT switch to other languages or teach unlisted topics.\n"
        f"2. Keep every single response to STRICTLY ONE OR TWO short, natural conversational sentences in English.\n"
        f"3. Speak mostly English. Say target {language_name} words clearly and slowly, immediately giving the English translation.\n"
        f"4. Listen to what the student says: if they said the current word correctly (or close enough), praise them ('Spot on!') and immediately advance to the NEXT vocabulary item or phrase in the list.\n"
        f"5. Once the individual words are practiced, ask them to say the FULL sentence together, and celebrate when they do!\n"
        f"6. Do NOT use special symbols, emojis, or markdown in your speech."
    )

    return "\n".join(sections)


from vision_agent.free_providers import GroqSTT, GroqLLM, EdgeTTS

# ── Agent Factory ─────────────────────────────────────────────────────────────

def create_agent(custom_data: dict[str, Any] | None = None) -> Agent:
    """
    Build and return a fresh Agent instance.
    Automatically uses free providers (Groq STT/LLM + EdgeTTS) if GROQ_API_KEY is present,
    or falls back to OpenAI Realtime.
    """
    edge = Edge()
    agent_user = User(
        id=AGENT_USER_ID,
        name=AGENT_NAME,
    )

    instructions = _build_instructions(custom_data or {})
    groq_api_key = os.getenv("GROQ_API_KEY")
    use_free_ai = os.getenv("USE_FREE_AI", "").lower() in ("true", "1", "yes")

    if groq_api_key or use_free_ai:
        if not groq_api_key:
            logger.warning("USE_FREE_AI is set but GROQ_API_KEY is missing! Get a free key at https://console.groq.com")
        logger.info("🤖 Initializing Luna using Free AI Stack (Groq STT + LLaMA-3 + EdgeTTS)")
        stt = GroqSTT(api_key=groq_api_key or "")
        llm = GroqLLM(api_key=groq_api_key or "", system_prompt=instructions)
        tts = EdgeTTS(voice="en-US-AriaNeural")

        return Agent(
            edge=edge,
            llm=llm,
            stt=stt,
            tts=tts,
            agent_user=agent_user,
            instructions=instructions,
        )

    logger.info("🤖 Initializing Luna using OpenAI Realtime API")
    llm = Realtime(
        model="gpt-4o-mini-realtime-preview",
        voice="alloy",      # friendly, neutral English voice
        send_video=False,   # voice-only teacher, no video
    )

    return Agent(
        edge=edge,
        llm=llm,
        agent_user=agent_user,
        instructions=instructions,
    )


# ── Global store for lesson custom_data sent by Expo app ──────────────────────
CALL_CUSTOM_DATA: dict[str, dict[str, Any]] = {}


# ── Join Call Handler ─────────────────────────────────────────────────────────

async def join_call(agent: Agent, call_type: str, call_id: str) -> None:
    """
    Join a Stream call, greet the student, then stay alive and respond
    interactively until the call ends (student hangs up or idle timeout fires).
    """
    custom_data = CALL_CUSTOM_DATA.get(call_id, {})
    new_instructions = _build_instructions(custom_data)
    agent.instructions = Instructions(input_text=new_instructions)
    if hasattr(agent.llm, "set_instructions"):
        agent.llm.set_instructions(new_instructions)

    language_name = custom_data.get("language_name") or "your target language"
    lesson_title = custom_data.get("lesson_title") or "General Conversation"

    logger.info(f"Luna joining call: {call_type}/{call_id} for language: {language_name}")

    call = await agent.create_call(call_type=call_type, call_id=call_id)

    try:
        await call.update_call_members(
            update_members=[
                {
                    "user_id": AGENT_USER_ID,
                    "role": "admin",
                }
            ]
        )
    except Exception as exc:
        logger.warning(f"Could not set admin role (continuing anyway): {exc}")

    # ── Realtime Live Caption Broadcaster ─────────────────────────────────
    import time
    async def broadcast_caption(speaker_id: str, speaker_name: str, text: str, role: str):
        if not text or not text.strip():
            return
        clean_text = text.strip()
        logger.info(f"💬 [Caption] {speaker_name} ({role}): {clean_text}")

        # 1. Stream Video Closed Caption API
        try:
            await call.send_closed_caption(
                speaker_id=speaker_id,
                text=clean_text,
                user_id=speaker_id,
            )
        except Exception as e:
            logger.debug(f"send_closed_caption notice: {e}")

        # 2. Stream Video Custom Call Event (realtime instant broadcast to mobile client)
        try:
            await call.send_call_event(
                custom={
                    "type": "caption",
                    "speaker_id": speaker_id,
                    "speaker_name": speaker_name,
                    "role": role,
                    "text": clean_text,
                    "timestamp": time.time(),
                }
            )
        except Exception as e:
            logger.debug(f"send_call_event notice: {e}")

    # Wire caption callbacks on active providers
    if hasattr(agent, "stt") and hasattr(agent.stt, "set_caption_callback"):
        agent.stt.set_caption_callback(broadcast_caption)
    if hasattr(agent, "tts") and hasattr(agent.tts, "set_caption_callback"):
        agent.tts.set_caption_callback(broadcast_caption)

    # Build a warm, energetic opening greeting
    opening_prompt = (
        f"You are Luna, starting a live {language_name} lesson called '{lesson_title}'. "
        f"Greet the student with genuine warmth and excitement in ONE short English sentence. "
        f"Then immediately say the very first target-language word slowly and clearly, "
        f"give its English meaning, and invite the student to repeat it after you. "
        f"Keep it to 2 sentences maximum. No markdown, no asterisks, plain spoken text only."
    )

    async with agent.join(call, participant_wait_timeout=60):
        # ── Opening greeting ──────────────────────────────────────────────────
        await agent.simple_response(opening_prompt)

        # ── Interactive lesson loop ───────────────────────────────────────────
        # The TranscribingInferenceFlow (STT→LLM→TTS) is active inside agent.join().
        # agent.finish() waits for the call to end naturally (student hangs up or
        # idle_timeout fires). While waiting, Luna listens and responds automatically.
        await agent.finish()

    logger.info(f"Luna left call: {call_type}/{call_id}")



# ── Runner Setup ──────────────────────────────────────────────────────────────

launcher = AgentLauncher(
    create_agent=create_agent,
    join_call=join_call,
    # Auto-close if no human joins within 2 minutes
    agent_idle_timeout=120.0,
    # One Luna per lesson call
    max_sessions_per_call=1,
)

runner = Runner(
    launcher=launcher,
    serve_options=ServeOptions(
        # Allow the Expo dev server and any local origin
        cors_allow_origins=["*"],
    ),
)


# ── API Routes for Expo App Integration ───────────────────────────────────────
from fastapi import Body, HTTPException


@runner.fast_api.post("/start")
async def start_agent_endpoint(payload: dict = Body(...)):
    """
    POST /start
    Triggered by Expo app (via agent-start+api.ts) when a user joins a lesson.
    Spawns Luna and joins the specified Stream call with lesson context.
    """
    call_type = payload.get("call_type", "default")
    call_id = payload.get("call_id")
    custom_data = payload.get("custom_data", {})

    if not call_id:
        raise HTTPException(status_code=400, detail="call_id is required")

    CALL_CUSTOM_DATA[call_id] = custom_data

    try:
        session = await launcher.start_session(call_id=call_id, call_type=call_type)
        return {
            "success": True,
            "session_id": session.id,
            "call_id": call_id,
        }
    except Exception as exc:
        logger.exception(f"Failed to start agent session for call {call_id}")
        raise HTTPException(status_code=500, detail=str(exc))


@runner.fast_api.post("/stop")
async def stop_agent_endpoint(payload: dict = Body(...)):
    """
    POST /stop
    Triggered by Expo app (via agent-stop+api.ts) when a user leaves the call.
    Stops Luna's agent session cleanly.
    """
    call_id = payload.get("call_id")
    session_id = payload.get("session_id")

    if session_id:
        try:
            await launcher.close_session(session_id)
        except Exception as exc:
            logger.warning(f"Error closing session {session_id}: {exc}")

    if call_id:
        CALL_CUSTOM_DATA.pop(call_id, None)
        sessions_to_close = [
            s.id
            for s in list(launcher._sessions.values())
            if getattr(s, "call_id", None) == call_id
        ]
        for s_id in sessions_to_close:
            try:
                await launcher.close_session(s_id)
            except Exception as exc:
                logger.warning(f"Error closing session {s_id} for call {call_id}: {exc}")

    return {"success": True}

