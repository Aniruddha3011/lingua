"""
vision_agent — Entry point module.

Run with:
    python -m vision_agent run          # single call (opens Stream demo UI)
    python -m vision_agent serve        # HTTP server mode (for webhook dispatch)
    python -m vision_agent run --no-demo --call-id my-lesson-id
"""

from .agent import create_agent, join_call, launcher, runner

__all__ = ["create_agent", "join_call", "launcher", "runner"]
