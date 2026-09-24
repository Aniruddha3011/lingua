"""
CLI entry point — allows `python -m vision_agent <subcommand>`.
"""

from .agent import runner

if __name__ == "__main__":
    runner.cli()
