/**
 * POST /api/agent-start
 *
 * Proxies to the Python vision-agent server to start Luna (the AI teacher).
 * Packs lesson context into the request body so the agent can read it on join.
 * Stream API credentials never touch the mobile client.
 */

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      callType,
      callId,
      lessonId,
      lessonTitle,
      languageId,
      languageName,
      goals,
      vocabulary,
      phrases,
      aiTeacherPrompt,
    } = body as {
      callType: string;
      callId: string;
      lessonId?: string;
      lessonTitle?: string;
      languageId?: string;
      languageName?: string;
      goals?: { description: string; xpReward: number }[];
      vocabulary?: { word: string; translation: string }[];
      phrases?: { text: string; translation: string }[];
      aiTeacherPrompt?: string;
    };

    if (!callId || !callType) {
      return Response.json(
        { success: false, error: "callId and callType are required" },
        { status: 400 }
      );
    }

    const agentServerUrl =
      process.env.VISION_AGENT_SERVER_URL || "http://127.0.0.1:8000";

    // Build the lesson context to send to the agent.
    // The Python agent reads these from the call's custom data.
    const customData = {
      lesson_id: lessonId ?? null,
      lesson_title: lessonTitle ?? null,
      language_id: languageId ?? null,
      language_name: languageName ?? null,
      goals: goals ?? [],
      vocabulary: vocabulary ?? [],
      phrases: phrases ?? [],
      ai_teacher_prompt: aiTeacherPrompt ?? null,
    };

    const res = await fetch(`${agentServerUrl}/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        call_type: callType,
        call_id: callId,
        custom_data: customData,
      }),
      // 5s timeout to fail fast if the Python server is down
      signal: AbortSignal.timeout(5000),
    });

    const data = (await res.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;

    if (!res.ok) {
      return Response.json(
        {
          success: false,
          error:
            (data.detail as string) ??
            `Agent server responded with ${res.status}`,
        },
        { status: res.status }
      );
    }

    return Response.json({ success: true, sessionId: data.session_id ?? null });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to start agent";
    const isTimeout = message.includes("timed out") || message.includes("AbortError");
    return Response.json(
      {
        success: false,
        error: isTimeout
          ? "AI teacher server is not reachable. Start the vision-agent first."
          : message,
      },
      { status: 503 }
    );
  }
}
