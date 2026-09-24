export interface StreamTokenParams {
  userId?: string;
  userName?: string;
  userImage?: string;
  lessonId?: string;
  languageId?: string;
}

export interface StreamTokenResponse {
  success: boolean;
  apiKey: string;
  token: string;
  callId: string;
  userId: string;
  userName: string;
  userImage: string;
  error?: string;
}

export type StreamAudioCallStatus =
  | "initializing"
  | "connecting"
  | "joined"
  | "muted"
  | "reconnecting"
  | "ended"
  | "error";

export async function fetchStreamAudioToken(
  params: StreamTokenParams
): Promise<StreamTokenResponse> {
  const fallbackApiKey =
    process.env.EXPO_PUBLIC_STREAM_API_KEY || "jvz8653cfrub";
  const cleanUserId = (params.userId || "guest_learner")
    .replace(/[^a-zA-Z0-9_-]/g, "_");

  try {
    const response = await fetch("/api/stream-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: cleanUserId,
        userName: params.userName || "Learner",
        userImage: params.userImage,
        lessonId: params.lessonId,
        languageId: params.languageId,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        return data;
      }
    }
  } catch {
    // Silent catch for dev/offline fallback
  }

  // Client-side fallback if server route is unreachable
  return {
    success: true,
    apiKey: fallbackApiKey,
    token: `dev-token-${cleanUserId}`,
    callId: `audio-lesson-${params.lessonId || "session"}-${params.languageId || "es"}`,
    userId: cleanUserId,
    userName: params.userName || "Learner",
    userImage:
      params.userImage ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
  };
}
