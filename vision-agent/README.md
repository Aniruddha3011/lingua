# Luna — AI Language Teacher (vision-agent)

Voice-only AI language teacher built with:

- **OpenAI Realtime API** (`gpt-4o-realtime-preview`) — speech-to-speech LLM
- **Stream Edge** (getstream.io) — WebRTC transport
- **vision-agents SDK** — agent lifecycle and call management

---

## How It Works

```
Expo App (student) ──► Stream SFU ──► Luna (this service)
                                          │
                                          ▼
                                   OpenAI Realtime API
                               (hears student, responds in audio)
```

1. Student opens a lesson in the app and taps **Start Lesson**
2. The Expo app creates a Stream call and connects
3. This service joins the same call as the AI teacher ("Luna")
4. Luna greets the student and begins teaching through voice

---

## Setup

### 1. Environment

The `.env` file in this directory is pre-configured. Verify it has:

```env
OPENAI_API_KEY=sk-...
STREAM_API_KEY=jvz8653cfrub
STREAM_API_SECRET=2pbfearqw3xwraqfep5fhw2c59ww4d9jqp4x2rujb2xdaqpth5fwptbces8kczfe
AGENT_USER_ID=ai-language-teacher
AGENT_NAME=Luna
```

### 2. Start the service

**Option A — Serve mode (recommended for development)**

The HTTP server listens for webhook calls from the Expo app.
When a student starts a lesson, the app POSTs to this server and Luna joins.

```powershell
cd vision-agent
.\.venv\Scripts\python.exe -m vision_agent serve --port 8000
```

**Option B — Single call mode (quick testing)**

Joins a single call and opens the Stream demo UI in your browser.

```powershell
cd vision-agent
.\.venv\Scripts\python.exe -m vision_agent run
```

Join the demo from your browser to speak with Luna.

---

## Customise the Teacher

Edit [`instructions.md`](./instructions.md) to change Luna's:
- Personality and teaching style
- What languages to support
- How she handles mistakes and praise

The agent reads this file at runtime — no restart required between calls.

---

## File Structure

```
vision-agent/
  src/
    vision_agent/
      agent.py        ← Agent factory + join_call + Runner setup
      __init__.py     ← Re-exports
      __main__.py     ← CLI entry point (python -m vision_agent)
  instructions.md     ← Teacher personality prompt
  .env                ← Secrets (never commit to Git)
  pyproject.toml      ← Project config + dependencies
```

---

## Integration with the Expo App

The Expo app's `lesson/[id].tsx` screen already calls `fetchStreamAudioToken` to
get a token and join a Stream call. To connect Luna:

1. Start this service in **serve mode** (`--port 8000`)
2. When the app creates/joins a call, POST to `http://localhost:8000/start`  
   with body `{ "call_type": "audio", "call_id": "<lesson-id>" }`
3. Luna will automatically join the same call

> For production: deploy this service (e.g. Railway, Fly.io, a VPS) and update
> the endpoint URL in the Expo app's API route.
