import Constants from "expo-constants";
import { Platform } from "react-native";

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

export function getStreamAudioCallId(params: StreamTokenParams): string {
  return `audio-lesson-${params.lessonId || "session"}-${params.languageId || "general"}`;
}

function getApiBaseUrls(): string[] {
  const urls: string[] = [];

  if (Platform.OS === "web" && typeof window !== "undefined") {
    urls.push(window.location.origin);
  }

  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.manifest2?.extra?.expoGo?.debuggerHost;

  if (hostUri) {
    urls.push(`http://${hostUri.split(":")[0]}:8081`);
  }

  if (Platform.OS === "android") {
    urls.push("http://10.0.2.2:8081");
  }

  urls.push("http://127.0.0.1:8081");
  urls.push("http://localhost:8081");

  return [...new Set(urls)];
}

function failedTokenResponse(
  params: StreamTokenParams,
  error: string
): StreamTokenResponse {
  const userId = (params.userId || "").replace(/[^a-zA-Z0-9_-]/g, "_");

  return {
    success: false,
    apiKey: "",
    token: "",
    callId: getStreamAudioCallId(params),
    userId,
    userName: params.userName || "Learner",
    userImage: params.userImage || "",
    error,
  };
}

export async function fetchStreamAudioToken(
  params: StreamTokenParams
): Promise<StreamTokenResponse> {
  const cleanUserId = (params.userId || "").replace(/[^a-zA-Z0-9_-]/g, "_");

  if (!cleanUserId) {
    return failedTokenResponse(params, "Sign in before starting an audio lesson.");
  }

  let lastError = "Could not reach the Expo API server.";

  for (const baseUrl of getApiBaseUrls()) {
    try {
      const response = await fetch(`${baseUrl}/api/stream-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: cleanUserId,
          userName: params.userName || "Learner",
          userImage: params.userImage,
          lessonId: params.lessonId,
          languageId: params.languageId,
        }),
        signal: AbortSignal.timeout(6000),
      });

      const data = (await response.json().catch(() => ({}))) as Partial<StreamTokenResponse>;

      if (response.ok && data.success && data.apiKey && data.token) {
        return data as StreamTokenResponse;
      }

      lastError = data.error || `Token server returned status ${response.status}.`;
    } catch (error) {
      lastError = error instanceof Error ? error.message : "Network request failed.";
    }
  }

  return failedTokenResponse(params, lastError);
}
