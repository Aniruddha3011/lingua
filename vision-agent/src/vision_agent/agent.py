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
from vision_agents.plugins.getstream import Edge
from vision_agents.plugins.openai import Realtime

# ── Environment ───────────────────────────────────────────────────────────────
# Load vision-agent/.env first, then fall back to the parent repo .env
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

    custom_data keys (all optional):
        lesson_id, lesson_title, language_id, language_name,
        goals, vocabulary, phrases, ai_teacher_prompt
    """
    language_name = custom_data.get("language_name") or "the target language"
    lesson_title = custom_data.get("lesson_title") or "General Conversation"
    goals: list[dict] = custom_data.get("goals") or []
    vocabulary: list[dict] = custom_data.get("vocabulary") or []
    phrases: list[dict] = custom_data.get("phrases") or []
    ai_teacher_prompt: str | None = custom_data.get("ai_teacher_prompt")

    sections = [BASE_INSTRUCTIONS, ""]

    # ── Lesson context injected at runtime ──────────────────────────────────
    sections.append(f"## Current Lesson Context\n")
    sections.append(f"- **Language you are teaching:** {language_name}")
    sections.append(f"- **Lesson title:** {lesson_title}")

    if goals:
        sections.append("\n**Lesson goals:**")
        for g in goals:
            sections.append(f"  - {g.get('description', '')}")

    if vocabulary:
        sections.append("\n**Vocabulary to teach this session:**")
        for v in vocabulary:
            word = v.get("word", "")
            translation = v.get("translation", "")
            phonetic = v.get("phonetic", "")
            line = f"  - {word} → {translation}"
            if phonetic:
                line += f" (/{phonetic}/)"
            sections.append(line)

    if phrases:
        sections.append("\n**Key phrases for this lesson:**")
        for p in phrases:
            text = p.get("text", "")
            translation = p.get("translation", "")
            sections.append(f"  - \"{text}\" → \"{translation}\"")

    if ai_teacher_prompt:
        sections.append(f"\n**Extra teaching note:** {ai_teacher_prompt}")

    sections.append(
        "\nFocus this session on the vocabulary and phrases listed above. "
        "Introduce them one at a time. Ask the student to repeat after you."
    )

    return "\n".join(sections)


# ── Agent Factory ─────────────────────────────────────────────────────────────

def create_agent(custom_data: dict[str, Any] | None = None) -> Agent:
    """
    Build and return a fresh Agent instance.

    custom_data is populated by the Expo app via agent-start+api.ts and
    contains lesson_title, language_name, goals, vocabulary, phrases, etc.
    """
    # Stream Edge — reads STREAM_API_KEY + STREAM_API_SECRET from env
    edge = Edge()

    # OpenAI Realtime — reads OPENAI_API_KEY from env
    # send_video=False  → audio-only session (no camera needed)
    llm = Realtime(
        model="gpt-4o-realtime-preview",
        voice="alloy",      # friendly, neutral English voice
        send_video=False,   # voice-only teacher, no video
    )

    # Agent identity on the Stream call
    agent_user = User(
        id=AGENT_USER_ID,
        name=AGENT_NAME,
    )

    instructions = _build_instructions(custom_data or {})

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
    Join a Stream call and keep Luna alive until the call ends.

    The call is created with:
      - admin role so Luna can publish audio in audio_room
      - goLive() to activate the room before publishing
    """
    custom_data = CALL_CUSTOM_DATA.get(call_id, {})
    agent.instructions = _build_instructions(custom_data)

    language_name = custom_data.get("language_name") or "your target language"
    lesson_title = custom_data.get("lesson_title") or "General Conversation"

    logger.info(f"Luna joining call: {call_type}/{call_id} for language: {language_name}")

    # Get or create the call on Stream's backend
    call = await agent.create_call(call_type=call_type, call_id=call_id)

    # Grant Luna admin role so she can publish audio in audio_room
    # and go live to activate the session.
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

    try:
        await call.go_live()
    except Exception as exc:
        logger.warning(f"go_live() failed (continuing anyway): {exc}")

    async with agent.join(call):
        # Greet the student once Luna joins
        await agent.simple_response(
            f"Greet the student warmly in English, introduce yourself as Luna their AI language teacher, "
            f"mention that today's lesson is '{lesson_title}' in {language_name}, and ask if they are ready to begin."
        )

        # Keep Luna alive until the call ends or the screen unmounts
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
    call_type = payload.get("call_type", "audio_room")
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

