/**
 * POST /api/agent-stop
 *
 * Proxies to the Python vision-agent server to cleanly stop Luna's session.
 * Called both when the user taps "End Call" and when the lesson screen unmounts.
 */

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { callType, callId } = body as {
      callType: string;
      callId: string;
    };

    if (!callId || !callType) {
      return Response.json(
        { success: false, error: "callId and callType are required" },
        { status: 400 }
      );
    }

    const agentServerUrl =
      process.env.VISION_AGENT_SERVER_URL || "http://127.0.0.1:8000";

    const res = await fetch(`${agentServerUrl}/stop`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ call_type: callType, call_id: callId }),
      signal: AbortSignal.timeout(3000),
    });

    // If the agent is already gone (404/session expired) that's fine — no error.
    if (res.status === 404 || res.ok) {
      return Response.json({ success: true });
    }

    const data = (await res.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;
    return Response.json(
      {
        success: false,
        error: (data.detail as string) ?? `Agent server responded with ${res.status}`,
      },
      { status: res.status }
    );
  } catch {
    // Best-effort stop: swallow network errors (server may already be down)
    return Response.json({ success: true });
  }
}
