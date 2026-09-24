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

    const apiKey =
      process.env.EXPO_PUBLIC_STREAM_API_KEY ||
      process.env.STREAM_API_KEY ||
      "jvz8653cfrub";

    const apiSecret =
      process.env.STREAM_API_SECRET ||
      process.env.STREAM_SECRET_KEY ||
      "2pbfearqw3xwraqfep5fhw2c59ww4d9jqp4x2rujb2xdaqpth5fwptbces8kczfe";

    // Clean user ID for Stream requirements (alphanumeric, -, _)
    const cleanUserId = (userId || "guest_learner")
      .toString()
      .replace(/[^a-zA-Z0-9_-]/g, "_");

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
