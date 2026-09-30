import Constants from "expo-constants";
import { Platform } from "react-native";
import type { Language, Lesson } from "@/types/learning";

// Status of the Luna AI teacher agent connection
export type AgentStatus = "idle" | "connecting" | "connected" | "failed";

export interface AgentStartParams {
  callType: string;
  callId: string;
  lesson?: Lesson;
  language?: Language;
}

export interface AgentStartResult {
  success: boolean;
  sessionId?: string | null;
  error?: string;
}

function getApiBaseUrls(): string[] {
  const urls: string[] = [];

  // Web environment
  if (Platform.OS === "web" && typeof window !== "undefined" && window.location?.origin) {
    urls.push(window.location.origin);
  }

  // Expo Go / Native environment host IP
  const hostUri = Constants.expoConfig?.hostUri || Constants.manifest2?.extra?.expoGo?.debuggerHost;
  if (hostUri) {
    const ip = hostUri.split(":")[0];
    urls.push(`http://${ip}:8081`);
    urls.push(`http://${ip}:8000`); // Direct Python server on host IP
  }

  // Android emulator loopback & localhost fallbacks
  if (Platform.OS === "android") {
    urls.push("http://10.0.2.2:8081");
    urls.push("http://10.0.2.2:8000");
  }

  urls.push("http://127.0.0.1:8000");
  urls.push("http://localhost:8000");
  urls.push("http://127.0.0.1:8081");

  return [...new Set(urls)];
}

/**
 * Ask the Expo API route or Python Vision Agent server to start Luna.
 * Uses robust URL resolution so it works across Web, iOS, Android emulator, and physical devices.
 */
export async function startAgent(
  params: AgentStartParams
): Promise<AgentStartResult> {
  const { callType, callId, lesson, language } = params;

  const payload = {
    callType,
    callId,
    lessonId: lesson?.id,
    lessonTitle: lesson?.title,
    languageId: language?.id,
    languageName: language?.name,
    goals: lesson?.goals?.map((g) => ({
      description: g.description,
      xpReward: g.xpReward,
    })),
    vocabulary: lesson?.vocabulary?.map((v) => ({
      word: v.word,
      translation: v.translation,
      phonetic: v.phonetic,
      partOfSpeech: v.partOfSpeech,
    })),
    phrases: lesson?.phrases?.map((p) => ({
      text: p.text,
      translation: p.translation,
      phonetic: p.phonetic,
    })),
    aiTeacherPrompt: lesson?.aiTeacherPrompt,
  };

  const baseUrls = getApiBaseUrls();
  let lastError = "Could not reach AI teacher server";

  for (const baseUrl of baseUrls) {
    try {
      const isDirectPython = baseUrl.includes(":8000");
      const endpoint = isDirectPython
        ? `${baseUrl}/start`
        : `${baseUrl}/api/agent-start`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isDirectPython
            ? {
                call_type: callType,
                call_id: callId,
                custom_data: {
                  lesson_id: lesson?.id,
                  lesson_title: lesson?.title,
                  language_id: language?.id,
                  language_name: language?.name,
                  goals: payload.goals,
                  vocabulary: payload.vocabulary,
                  phrases: payload.phrases,
                  ai_teacher_prompt: lesson?.aiTeacherPrompt,
                },
              }
            : payload
        ),
        signal: AbortSignal.timeout(6000),
      });

      if (response.ok) {
        const data = (await response.json().catch(() => ({}))) as AgentStartResult;
        if (data.success) {
          return data;
        }
        lastError = data.error || `Server returned status ${response.status}`;
      } else {
        const errorData = (await response.json().catch(() => ({}))) as { error?: string; detail?: string };
        lastError = errorData.error || errorData.detail || `Server error ${response.status}`;
      }
    } catch (err) {
      lastError = err instanceof Error ? err.message : "Network request failed";
    }
  }

  return {
    success: false,
    error: lastError,
  };
}

/**
 * Ask the Expo API route or Python Vision Agent server to stop Luna for this call.
 * Best-effort — never throws. Safe to call on unmount.
 */
export async function stopAgent(params: {
  callType: string;
  callId: string;
}): Promise<void> {
  const baseUrls = getApiBaseUrls();

  for (const baseUrl of baseUrls) {
    try {
      const isDirectPython = baseUrl.includes(":8000");
      const endpoint = isDirectPython
        ? `${baseUrl}/stop`
        : `${baseUrl}/api/agent-stop`;

      await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isDirectPython
            ? { call_type: params.callType, call_id: params.callId }
            : params
        ),
        signal: AbortSignal.timeout(3000),
      });
    } catch {
      // Best-effort cleanup
    }
  }
}
