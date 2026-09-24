import type { Lesson } from "@/types/learning";
import type { Language } from "@/types/learning";

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

/**
 * Ask the Expo API route to start Luna (the AI teacher) for this call.
 * The Expo server proxies to the Python vision-agent — secrets stay server-side.
 */
export async function startAgent(
  params: AgentStartParams
): Promise<AgentStartResult> {
  const { callType, callId, lesson, language } = params;

  try {
    const response = await fetch("/api/agent-start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
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
      }),
    });

    const data = (await response.json().catch(() => ({}))) as AgentStartResult;
    return data;
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Could not reach AI teacher server",
    };
  }
}

/**
 * Ask the Expo API route to stop Luna for this call.
 * Best-effort — never throws. Safe to call on unmount.
 */
export async function stopAgent(params: {
  callType: string;
  callId: string;
}): Promise<void> {
  try {
    await fetch("/api/agent-stop", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
  } catch {
    // Intentionally swallowed — cleanup is best-effort
  }
}
