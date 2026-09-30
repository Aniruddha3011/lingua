import crypto from "crypto";

function base64url(str: string): string {
  return Buffer.from(str)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function generateStreamToken(userId: string, secret: string): string {
  const header = JSON.stringify({ alg: "HS256", typ: "JWT" });
  const payload = JSON.stringify({
    user_id: userId,
    role: "admin",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600 * 24,
  });

  const encodedHeader = base64url(header);
  const encodedPayload = base64url(payload);

  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { userId, userName, userImage, lessonId, languageId } = body;

    const apiKey = process.env.EXPO_PUBLIC_STREAM_API_KEY || process.env.STREAM_API_KEY;
    const apiSecret = process.env.STREAM_API_SECRET || process.env.STREAM_SECRET_KEY;

    if (!apiKey || !apiSecret) {
      return Response.json(
        {
          success: false,
          error: "Stream server credentials are not configured.",
        },
        { status: 503 }
      );
    }

    // Clean user ID for Stream requirements (alphanumeric, -, _)
    const cleanUserId = (userId || "")
      .toString()
      .replace(/[^a-zA-Z0-9_-]/g, "_");

    if (!cleanUserId) {
      return Response.json(
        { success: false, error: "A signed-in user ID is required." },
        { status: 400 }
      );
    }

    const token = generateStreamToken(cleanUserId, apiSecret);
    const callId = `audio-lesson-${lessonId || "session"}-${languageId || "general"}`;

    return Response.json({
      success: true,
      apiKey,
      token,
      callId,
      userId: cleanUserId,
      userName: userName || "Learner",
      userImage: userImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate Stream token",
      },
      { status: 500 }
    );
  }
}
