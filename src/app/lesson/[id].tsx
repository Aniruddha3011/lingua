import { useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { Image as ExpoImage } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  useStreamVideoConnection,
} from "@/components/stream-video-provider";
import { images } from "@/constants/images";
import { getLanguageById } from "@/data/languages";
import { getLessonById } from "@/data/lessons";
import { startAgent, stopAgent, type AgentStatus } from "@/lib/agent";
import { posthog } from "@/lib/posthog";
import { getStreamAudioCallId, type StreamAudioCallStatus } from "@/lib/stream";
import { useLanguageStore } from "@/store/useLanguageStore";

let CallingState: any = { LEFT: "LEFT" };
type Call = any;
let useStreamVideoClient: any = () => null;
let useAudioDeviceStatus: any = () => undefined;
let callManager: any = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const streamSdk = require("@stream-io/video-react-native-sdk");
  CallingState = streamSdk.CallingState;
  useStreamVideoClient = streamSdk.useStreamVideoClient;
  useAudioDeviceStatus = streamSdk.useAudioDeviceStatus;
  callManager = streamSdk.callManager;
} catch {
  // WebRTC native module not linked in current binary
}

const DEFAULT_PHRASES: Record<string, { phrase: string; translation: string }> = {
  spanish: { phrase: "¡Muy bien!", translation: "That was great! 👏" },
  french: { phrase: "C'est très bien !", translation: "Wonderful job! 👏" },
  german: { phrase: "Sehr gut!", translation: "That was excellent! 👏" },
  japanese: { phrase: "すばらしい！", translation: "Great job! 👏" },
  korean: { phrase: "아주 잘했어요!", translation: "Great work! 👏" },
  chinese: { phrase: "太棒了！", translation: "Awesome job! 👏" },
  italian: { phrase: "Molto bene!", translation: "That was great! 👏" },
};

async function requestAudioPermissions(): Promise<boolean> {
  if (Platform.OS !== "android") {
    return true;
  }

  const permissionsToRequest: any[] = [
    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
  ];
  if (PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT) {
    permissionsToRequest.push(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT);
  }

  try {
    const results = await PermissionsAndroid.requestMultiple(permissionsToRequest);
    return (
      results[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] ===
      PermissionsAndroid.RESULTS.GRANTED
    );
  } catch {
    return false;
  }
}

export interface LiveCaption {
  id: string;
  speakerId: string;
  speakerName: string;
  role: "teacher" | "student";
  text: string;
  timestamp: number;
}

export default function AITeacherAudioLessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isLoaded: isUserLoaded, user } = useUser();
  const streamClient = useStreamVideoClient();
  const streamConnection = useStreamVideoConnection();
  const selectedLanguageId = useLanguageStore((state) => state.selectedLanguageId);

  const lesson = id ? getLessonById(id) : undefined;
  const language = lesson
    ? getLanguageById(lesson.languageId)
    : selectedLanguageId
    ? getLanguageById(selectedLanguageId)
    : undefined;

  // Stream Audio Call Session States
  const [callStatus, setCallStatus] = useState<StreamAudioCallStatus>("initializing");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Luna AI teacher agent states
  const [agentStatus, setAgentStatus] = useState<AgentStatus>("idle");
  const agentCallRef = useRef<{ callType: string; callId: string } | null>(null);
  const streamCallRef = useRef<Call | null>(null);

  // Audio & UI Controls
  const [isMicActive, setIsMicActive] = useState(true);
  const [isLunaSpeaking, setIsLunaSpeaking] = useState(false);
  const userManuallyMutedRef = useRef(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Real-time Live Captions State (Teacher & Student speech)
  const [liveCaptions, setLiveCaptions] = useState<LiveCaption[]>([]);
  const [activeCaption, setActiveCaption] = useState<LiveCaption | null>(null);
  const [showTranscriptLog, setShowTranscriptLog] = useState(false);

  // User Profile Info
  const userName = user?.fullName ?? user?.firstName ?? "Learner";
  const userAvatarUrl =
    user?.imageUrl ??
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80";

  // Phrase selection
  const languageKey = lesson?.languageId ?? selectedLanguageId ?? "spanish";
  const defaultPhrase = DEFAULT_PHRASES[languageKey] ?? DEFAULT_PHRASES.spanish;

  const currentPhrase =
    lesson?.phrases && lesson.phrases.length > 0
      ? {
          phrase: lesson.phrases[phraseIndex % lesson.phrases.length].text,
          translation: lesson.phrases[phraseIndex % lesson.phrases.length].translation,
        }
      : defaultPhrase;

  const effectiveCallStatus =
    streamConnection.status === "failed" ? "error" : callStatus;
  const effectiveErrorMessage =
    streamConnection.status === "failed"
      ? streamConnection.error || "Could not connect to Stream Audio."
      : errorMessage;

  // Audio Output Routing (Bluetooth / Speaker / Earpiece)
  const audioDeviceStatus = useAudioDeviceStatus?.();
  const devices = useMemo(
    () => audioDeviceStatus?.devices ?? [],
    [audioDeviceStatus?.devices]
  );
  const selectedDeviceId = audioDeviceStatus?.selectedDeviceId;
  const currentEndpointType = audioDeviceStatus?.currentEndpointType;

  // PostHog Lesson Metrics Tracking
  const lessonStartTimeRef = useRef<number>(Date.now());
  const phraseIndexRef = useRef<number>(phraseIndex);
  const isLessonCompletedRef = useRef<boolean>(false);

  useEffect(() => {
    phraseIndexRef.current = phraseIndex;
  }, [phraseIndex]);

  useEffect(() => {
    lessonStartTimeRef.current = Date.now();
    posthog?.capture("lesson_started", {
      lesson_id: lesson?.id ?? id ?? "unknown",
      language: language?.name ?? language?.id ?? "unknown",
      lesson_number: lesson?.order ?? 1,
    });

    return () => {
      if (!isLessonCompletedRef.current) {
        const timeIntoLessonSeconds = Math.max(
          0,
          Math.round((Date.now() - lessonStartTimeRef.current) / 1000)
        );
        posthog?.capture("lesson_abandoned", {
          lesson_id: lesson?.id ?? id ?? "unknown",
          time_into_lesson_seconds: timeIntoLessonSeconds,
          last_question_index: phraseIndexRef.current,
        });
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, language?.id, language?.name, lesson?.id, lesson?.order]);

  // Auto-switch to Bluetooth when a Bluetooth device is connected
  useEffect(() => {
    if (!devices || devices.length === 0 || !callManager) return;

    const bluetoothDevice = devices.find(
      (d: any) =>
        d.type === "Bluetooth Device" ||
        d.name?.toLowerCase().includes("bluetooth") ||
        d.name?.toLowerCase().includes("buds") ||
        d.name?.toLowerCase().includes("airpods") ||
        d.name?.toLowerCase().includes("headset") ||
        d.name?.toLowerCase().includes("wireless")
    );

    if (bluetoothDevice && selectedDeviceId !== bluetoothDevice.id) {
      try {
        callManager.audioDevices.select(bluetoothDevice.id);
      } catch (err) {
        console.warn("[Audio] Could not auto-route to Bluetooth:", err);
      }
    }
  }, [devices, selectedDeviceId]);

  // ─── Initialize Stream Call + Start Luna Agent ───
  useEffect(() => {
    if (!isUserLoaded || !user || !streamClient) {
      return;
    }

    const clerkUser = user;
    const connectedStreamClient = streamClient;
    let isMounted = true;

    async function initStreamCall() {
      setCallStatus("connecting");
      setErrorMessage(null);
      setAgentStatus("idle");

      try {
        const hasAudioPermission = await requestAudioPermissions();
        if (!hasAudioPermission) {
          setErrorMessage("Microphone permission is required to speak with Luna.");
          setCallStatus("error");
          return;
        }

        const callType = "default";
        const callId = getStreamAudioCallId({
          lessonId: lesson?.id,
          languageId: language?.id,
        });
        const call = connectedStreamClient.call(callType, callId, { reuseInstance: true });
        streamCallRef.current = call;

        await call.join({
          create: true,
          data: {
            members: [{ user_id: clerkUser.id, role: "admin" }],
            custom: {
              lesson_id: lesson?.id,
              lesson_title: lesson?.title,
              language_id: language?.id,
              language_name: language?.name,
            },
          },
        });
        await call.camera.disable().catch(() => {});
        await call.microphone.enable().catch((micErr: unknown) => {
          console.warn("[Stream] Mic enable warning:", micErr);
        });

        if (!isMounted) return;

        setCallStatus("joined");

        // ── Start Luna after Stream join ──────────────────────────────
        agentCallRef.current = { callType, callId };
        setAgentStatus("connecting");

        const agentRes = await startAgent({
          callType,
          callId,
          lesson,
          language,
        });

        if (!isMounted) return;

        if (agentRes.success) {
          setAgentStatus("connected");
        } else {
          // Luna unavailable — lesson still works, just without AI teacher
          setAgentStatus("failed");
          console.warn("[Luna] Could not start agent:", agentRes.error);
        }
      } catch (err) {
        if (isMounted) {
          setErrorMessage(err instanceof Error ? err.message : "Connection failed");
          setCallStatus("error");
          setAgentStatus("failed");
        }
      }
    }

    void initStreamCall();

    return () => {
      isMounted = false;
      // Cleanup: stop Luna when the screen unmounts (e.g. back button)
      if (agentCallRef.current) {
        void stopAgent(agentCallRef.current);
        agentCallRef.current = null;
      }

      const streamCall = streamCallRef.current;
      streamCallRef.current = null;
      if (streamCall && streamCall.state.callingState !== CallingState.LEFT) {
        void streamCall.leave();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUserLoaded, lesson?.id, language?.id, streamClient, user?.id]);

  // Auto-mute user mic when Luna speaks, and auto-unmute when Luna finishes
  useEffect(() => {
    const call = streamCallRef.current;
    if (!call || !call.state?.remoteParticipants$) return;

    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    const subscription = call.state.remoteParticipants$.subscribe(
      (participants: any[]) => {
        const agentParticipant = participants?.find(
          (p: any) =>
            p.userId === "ai-language-teacher" ||
            p.name === "Luna" ||
            p.role === "admin"
        );

        if (agentParticipant) {
          setAgentStatus("connected");
          const isAgentCurrentlySpeaking = Boolean(agentParticipant.isSpeaking);

          if (isAgentCurrentlySpeaking) {
            if (debounceTimer) clearTimeout(debounceTimer);
            setIsLunaSpeaking(true);
            // Disable microphone while Luna is speaking to eliminate echo and prevent interruptions
            void call.microphone.disable().catch(() => {});
          } else {
            // Re-enable microphone once Luna finishes speaking (unless user manually muted)
            if (debounceTimer) clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
              setIsLunaSpeaking(false);
              if (!userManuallyMutedRef.current) {
                void call.microphone.enable().catch(() => {});
              }
            }, 250);
          }
        }
      }
    );

    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      subscription?.unsubscribe?.();
    };
  }, [callStatus]);

  // ─── Real-Time Live Captions Subscription (Teacher & Student Speech) ───
  useEffect(() => {
    const call = streamCallRef.current;
    if (!call) return;

    const subscriptions: { unsubscribe?: () => void }[] = [];

    // 1. Closed captions observable from Stream CallState
    if (call.state?.closedCaptions$) {
      const sub = call.state.closedCaptions$.subscribe((captionsList: any[]) => {
        if (!captionsList || captionsList.length === 0) return;
        const latest = captionsList[captionsList.length - 1];
        if (!latest?.text) return;

        const isTeacher =
          latest.speaker_id === "ai-language-teacher" ||
          latest.user?.name === "Luna" ||
          latest.speaker_id?.toLowerCase().includes("teacher");

        const newCaption: LiveCaption = {
          id: `${latest.speaker_id}-${latest.start_time || Date.now()}`,
          speakerId: latest.speaker_id || (isTeacher ? "ai-language-teacher" : "user"),
          speakerName: isTeacher ? "Luna" : (user?.firstName || "You"),
          role: isTeacher ? "teacher" : "student",
          text: latest.text,
          timestamp: Date.now(),
        };

        setActiveCaption(newCaption);
        setLiveCaptions((prev) => {
          if (
            prev.some(
              (c) =>
                c.id === newCaption.id ||
                (c.text === newCaption.text && Math.abs(c.timestamp - newCaption.timestamp) < 2500)
            )
          ) {
            return prev;
          }
          return [...prev.slice(-15), newCaption];
        });
      });
      subscriptions.push(sub);
    }

    // 2. Direct event listeners for call.closed_caption and custom event
    if (typeof call.on === "function") {
      const offCc = call.on("call.closed_caption", (event: any) => {
        const cc = event?.closed_caption;
        if (!cc?.text) return;

        const isTeacher =
          cc.speaker_id === "ai-language-teacher" ||
          cc.user?.name === "Luna" ||
          cc.speaker_id?.toLowerCase().includes("teacher");

        const newCaption: LiveCaption = {
          id: `${cc.speaker_id}-${cc.start_time || Date.now()}`,
          speakerId: cc.speaker_id || (isTeacher ? "ai-language-teacher" : "user"),
          speakerName: isTeacher ? "Luna" : (user?.firstName || "You"),
          role: isTeacher ? "teacher" : "student",
          text: cc.text,
          timestamp: Date.now(),
        };

        setActiveCaption(newCaption);
        setLiveCaptions((prev) => {
          if (
            prev.some(
              (c) =>
                c.id === newCaption.id ||
                (c.text === newCaption.text && Math.abs(c.timestamp - newCaption.timestamp) < 2500)
            )
          ) {
            return prev;
          }
          return [...prev.slice(-15), newCaption];
        });
      });

      const offCustom = call.on("custom", (event: any) => {
        const payload = event?.custom;
        if (!payload || payload.type !== "caption" || !payload.text) return;

        const isTeacher =
          payload.role === "teacher" ||
          payload.speaker_id === "ai-language-teacher" ||
          payload.speaker_name === "Luna";

        const newCaption: LiveCaption = {
          id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          speakerId: payload.speaker_id || (isTeacher ? "ai-language-teacher" : "user"),
          speakerName: payload.speaker_name || (isTeacher ? "Luna" : (user?.firstName || "You")),
          role: isTeacher ? "teacher" : "student",
          text: payload.text,
          timestamp: payload.timestamp ? payload.timestamp * 1000 : Date.now(),
        };

        setActiveCaption(newCaption);
        setLiveCaptions((prev) => {
          if (
            prev.some(
              (c) =>
                c.text === newCaption.text && Math.abs(c.timestamp - newCaption.timestamp) < 2500
            )
          ) {
            return prev;
          }
          return [...prev.slice(-15), newCaption];
        });
      });

      if (typeof offCc === "function") subscriptions.push({ unsubscribe: offCc });
      if (typeof offCustom === "function") subscriptions.push({ unsubscribe: offCustom });
    }

    return () => {
      subscriptions.forEach((s) => s?.unsubscribe?.());
    };
  }, [callStatus, user?.firstName]);

  // ─── Control Handlers ───
  const handleToggleMic = async () => {
    const streamCall = streamCallRef.current;
    if (!streamCall) {
      return;
    }

    try {
      await streamCall.microphone.toggle();
      setIsMicActive((prev) => {
        const nextState = !prev;
        userManuallyMutedRef.current = !nextState;
        setCallStatus(nextState ? "joined" : "muted");
        return nextState;
      });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not update microphone.");
      setCallStatus("error");
    }
  };

  const handleToggleCamera = () => {
    setIsCameraActive((prev) => !prev);
  };

  const handleToggleSubtitles = () => {
    setShowSubtitles((prev) => !prev);
  };

  const handlePlaySound = () => {
    setIsPlayingAudio(true);
    setTimeout(() => {
      setIsPlayingAudio(false);
      setPhraseIndex((prev) => {
        const nextIndex = prev + 1;
        const totalPhrases = lesson?.phrases?.length ?? 0;
        // Mark lesson as completed once all phrases have been played through
        if (totalPhrases > 0 && nextIndex >= totalPhrases) {
          isLessonCompletedRef.current = true;
        }
        return nextIndex;
      });
    }, 1200);
  };

  const handleToggleAudioOutput = () => {
    if (!devices || devices.length === 0 || !callManager) return;
    const currentIndex = devices.findIndex((d: any) => d.id === selectedDeviceId);
    const nextIndex = (currentIndex + 1) % devices.length;
    const nextDevice = devices[nextIndex];
    if (nextDevice) {
      try {
        callManager.audioDevices.select(nextDevice.id);
      } catch (err) {
        console.warn("[Audio] Error switching audio output device:", err);
      }
    }
  };

  const handleEndCall = () => {
    setCallStatus("ended");
    setAgentStatus("idle");
    // Stop Luna cleanly before navigating away
    if (agentCallRef.current) {
      void stopAgent(agentCallRef.current);
      agentCallRef.current = null;
    }

    const streamCall = streamCallRef.current;
    streamCallRef.current = null;
    if (streamCall && streamCall.state.callingState !== CallingState.LEFT) {
      void streamCall.leave();
    }

    setTimeout(() => {
      router.back();
    }, 300);
  };

  const handleRetryCall = () => {
    setCallStatus("connecting");
    setErrorMessage(null);
    setTimeout(() => {
      setCallStatus("joined");
    }, 1000);
  };

  // ─── Status Badge Helpers ───
  const getStatusBadge = () => {
    switch (effectiveCallStatus) {
      case "connecting":
      case "initializing":
        return (
          <View className="flex-row items-center">
            <ActivityIndicator size="small" color="#EAB308" style={{ marginRight: 6 }} />
            <Text className="font-poppins-medium text-[12px] text-[#EAB308]">
              Connecting...
            </Text>
          </View>
        );
      case "joined":
        return (
          <View className="flex-row items-center">
            <View className="mr-1.5 size-2 rounded-full bg-[#22C55E]" />
            <Text className="font-poppins-medium text-[12px] text-[#22C55E]">
              Live
            </Text>
          </View>
        );
      case "muted":
        return (
          <View className="flex-row items-center">
            <View className="mr-1.5 size-2 rounded-full bg-[#EF4444]" />
            <Text className="font-poppins-medium text-[12px] text-[#EF4444]">
              Mic Muted
            </Text>
          </View>
        );
      case "ended":
        return (
          <View className="flex-row items-center">
            <View className="mr-1.5 size-2 rounded-full bg-[#9CA3AF]" />
            <Text className="font-poppins-medium text-[12px] text-[#9CA3AF]">
              Ended
            </Text>
          </View>
        );
      case "error":
        return (
          <View className="flex-row items-center">
            <View className="mr-1.5 size-2 rounded-full bg-[#EF4444]" />
            <Text className="font-poppins-medium text-[12px] text-[#EF4444]">
              Connection Error
            </Text>
          </View>
        );
      default:
        return (
          <View className="flex-row items-center">
            <View className="mr-1.5 size-2 rounded-full bg-[#22C55E]" />
            <Text className="font-poppins-medium text-[12px] text-[#22C55E]">
              Online
            </Text>
          </View>
        );
    }
  };

  // Agent status pill displayed inside the stage area
  const getAgentPill = () => {
    switch (agentStatus) {
      case "idle":
        return null;
      case "connecting":
        return (
          <View style={styles.agentPill}>
            <ActivityIndicator size="small" color="#6C4EF5" style={{ marginRight: 6 }} />
            <Text style={styles.agentPillText}>Luna joining...</Text>
          </View>
        );
      case "connected":
        return (
          <View style={[styles.agentPill, styles.agentPillConnected]}>
            <View style={styles.agentDot} />
            <Text style={[styles.agentPillText, { color: "#16A34A" }]}>Luna is here ✦</Text>
          </View>
        );
      case "failed":
        return (
          <View style={[styles.agentPill, styles.agentPillFailed]}>
            <Ionicons name="warning-outline" size={13} color="#D97706" style={{ marginRight: 4 }} />
            <Text style={[styles.agentPillText, { color: "#D97706" }]}>AI teacher offline</Text>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      {/* ─── Top Header Bar ─── */}
      <View className="h-[52px] flex-row items-center px-4 border-b border-[#F5F6F8]">
        <TouchableOpacity
          accessibilityLabel="Go back"
          className="mr-3 size-9 items-center justify-center rounded-full active:bg-[#F5F6F8]"
          onPress={handleEndCall}
        >
          <Ionicons name="chevron-back" size={24} color="#0D132B" />
        </TouchableOpacity>

        <View className="flex-1">
          <Text className="font-poppins-bold text-[18px] leading-[23px] text-text-primary" numberOfLines={1}>
            AI Teacher
          </Text>
          <View className="mt-0.5">{getStatusBadge()}</View>
        </View>

        {/* Header Badges */}
        <View className="flex-row items-center gap-2">
          <TouchableOpacity className="size-9 items-center justify-center rounded-full bg-[#F6F7FB]">
            <Ionicons name="videocam-outline" size={18} color="#0D132B" />
          </TouchableOpacity>

          <View className="h-9 flex-row items-center rounded-full bg-[#FFF8EC] px-2.5 border border-[#FFE5B4]">
            <Image source={images.streakFire} style={{ width: 16, height: 16 }} resizeMode="contain" />
            <Text className="ml-1 font-poppins-bold text-[13px] text-[#FF8A00]">12</Text>
          </View>

          <TouchableOpacity className="size-9 items-center justify-center rounded-full bg-[#F6F7FB]">
            <Ionicons name="person-outline" size={18} color="#0D132B" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Main Stage Area (Teacher & Student Call View) ─── */}
        <View style={styles.stageCard}>
          {/* Indoor Background Room Image / Texture */}
          <View style={styles.roomBackground}>
            <View style={styles.shelfDecorative} />
            <View style={styles.plantDecorative} />
          </View>

          {/* Center Teacher Mascot (Fox waving) */}
          <View style={styles.mascotContainer}>
            <Image
              source={images.mascotWelcome}
              style={styles.mascotTeacher}
              resizeMode="contain"
            />
          </View>

          {/* Student Camera Preview Inset (PiP frame top right) */}
          <View style={styles.studentCameraInset}>
            {isCameraActive ? (
              <ExpoImage
                source={{ uri: userAvatarUrl }}
                style={StyleSheet.absoluteFill}
                contentFit="cover"
              />
            ) : (
              <View className="size-full items-center justify-center bg-[#2D3748]">
                <Ionicons name="videocam-off-outline" size={24} color="#A0AEC0" />
              </View>
            )}
            {/* Student name overlay */}
            <View style={styles.studentNameOverlay}>
              <Text style={styles.studentNameText} numberOfLines={1}>
                {userName}
              </Text>
            </View>
          </View>

          {/* Connecting / Error Banner Overlays */}
          {effectiveCallStatus === "connecting" && (
            <View style={styles.connectingOverlay}>
              <ActivityIndicator size="large" color="#6C4EF5" />
              <Text className="mt-2 font-poppins-semibold text-[14px] text-brand-purple">
                Joining Stream audio session...
              </Text>
            </View>
          )}

          {effectiveCallStatus === "error" && (
            <View style={styles.errorOverlay}>
              <Ionicons name="alert-circle" size={32} color="#EF4444" />
              <Text className="mt-1 font-poppins-semibold text-[14px] text-[#EF4444] text-center">
                {effectiveErrorMessage || "Connection error"}
              </Text>
              <TouchableOpacity
                className="mt-3 rounded-xl bg-[#6C4EF5] px-4 py-2"
                onPress={handleRetryCall}
              >
                <Text className="font-poppins-semibold text-[13px] text-white">
                  Retry Connection
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Session Banner Tag */}
          <View style={styles.sessionBannerTag}>
            <Text className="font-poppins-semibold text-[11px] text-[#6C4EF5]">
              {language?.name ?? "Spanish"} • {lesson?.title ?? "AI Voice Lesson"}
            </Text>
          </View>

          {/* Luna Agent Status Pill */}
          {getAgentPill()}

          {/* Teacher & Student Real-Time Live Speech Subtitles / Caption Bubble */}
          {showSubtitles && effectiveCallStatus !== "error" && (
            <View style={styles.speechBubbleCard}>
              <View className="flex-1 pr-3">
                {activeCaption ? (
                  <>
                    <View className="flex-row items-center mb-1.5">
                      <View
                        style={[
                          styles.speakerBadgePill,
                          activeCaption.role === "teacher"
                            ? styles.speakerBadgeTeacher
                            : styles.speakerBadgeStudent,
                        ]}
                      >
                        <Text style={styles.speakerEmoji}>
                          {activeCaption.role === "teacher" ? "🦊" : "👤"}
                        </Text>
                        <Text
                          style={[
                            styles.speakerNameText,
                            activeCaption.role === "teacher"
                              ? styles.speakerTextTeacher
                              : styles.speakerTextStudent,
                          ]}
                        >
                          {activeCaption.role === "teacher"
                            ? "Luna • Teacher"
                            : `${userName} • You`}
                        </Text>
                      </View>
                      <View className="ml-2 flex-row items-center">
                        <View
                          style={[
                            styles.liveStatusDot,
                            {
                              backgroundColor:
                                activeCaption.role === "teacher" ? "#8B5CF6" : "#22C55E",
                            },
                          ]}
                        />
                        <Text style={styles.liveStatusText}>
                          {activeCaption.role === "teacher" ? "Speaking" : "Pronounced"}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.captionSpeechText}>
                      {activeCaption.text}
                    </Text>
                  </>
                ) : (
                  <>
                    <Text className="font-poppins-bold text-[17px] leading-[22px] text-[#0D132B]">
                      {currentPhrase.phrase}
                    </Text>
                    <Text className="mt-1 font-poppins-medium text-[14px] leading-[19px] text-[#4B5563]">
                      {currentPhrase.translation}
                    </Text>
                  </>
                )}
              </View>

              {/* Speaker sound button */}
              <TouchableOpacity
                accessibilityLabel="Play audio"
                activeOpacity={0.8}
                style={[
                  styles.speakerButton,
                  isPlayingAudio && styles.speakerButtonPlaying,
                ]}
                onPress={handlePlaySound}
              >
                <Ionicons
                  name={isPlayingAudio ? "volume-high" : "volume-medium"}
                  size={20}
                  color={isPlayingAudio ? "#FFFFFF" : "#6C4EF5"}
                />
              </TouchableOpacity>

              {/* Speech bubble tail pointer */}
              <View style={styles.speechTail} />
            </View>
          )}
        </View>

        {/* ─── Call Control Action Buttons Bar ─── */}
        <View className="mt-2 flex-row items-center justify-around px-3">
          {/* Camera Button */}
          <View className="items-center">
            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.controlButton,
                !isCameraActive && styles.controlButtonOff,
              ]}
              onPress={handleToggleCamera}
            >
              <Ionicons
                name={isCameraActive ? "videocam" : "videocam-off"}
                size={22}
                color={isCameraActive ? "#0D132B" : "#9CA3AF"}
              />
            </TouchableOpacity>
            <Text className="mt-1.5 font-poppins-medium text-[12px] text-[#6B7280]">
              Camera
            </Text>
          </View>

          {/* Mic Button (Auto-mutes when Luna speaks, opens for user when she finishes) */}
          <View className="items-center">
            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.controlButton,
                isLunaSpeaking && styles.controlButtonActive,
                !isMicActive && !isLunaSpeaking && styles.controlButtonMuted,
              ]}
              onPress={handleToggleMic}
            >
              <Ionicons
                name={
                  isLunaSpeaking
                    ? "volume-medium"
                    : isMicActive
                    ? "mic"
                    : "mic-off"
                }
                size={22}
                color={
                  isLunaSpeaking
                    ? "#6C4EF5"
                    : isMicActive
                    ? "#0D132B"
                    : "#FF4D4F"
                }
              />
            </TouchableOpacity>
            <Text className="mt-1.5 font-poppins-medium text-[12px] text-[#6B7280]">
              {isLunaSpeaking
                ? "Luna talking"
                : isMicActive
                ? "Your turn"
                : "Muted"}
            </Text>
          </View>

          {/* Audio Output / Bluetooth Button */}
          <View className="items-center">
            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.controlButton,
                currentEndpointType === "Bluetooth Device" && styles.controlButtonActive,
              ]}
              onPress={handleToggleAudioOutput}
            >
              <Ionicons
                name={
                  currentEndpointType === "Bluetooth Device"
                    ? "bluetooth"
                    : currentEndpointType === "Earpiece"
                    ? "ear"
                    : "volume-high"
                }
                size={22}
                color={
                  currentEndpointType === "Bluetooth Device"
                    ? "#6C4EF5"
                    : "#0D132B"
                }
              />
            </TouchableOpacity>
            <Text className="mt-1.5 font-poppins-medium text-[12px] text-[#6B7280]">
              {currentEndpointType === "Bluetooth Device"
                ? "Bluetooth"
                : currentEndpointType === "Earpiece"
                ? "Earpiece"
                : "Speaker"}
            </Text>
          </View>

          {/* Subtitles Button */}
          <View className="items-center">
            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.controlButton,
                showSubtitles && styles.controlButtonActive,
              ]}
              onPress={handleToggleSubtitles}
            >
              <Ionicons
                name="text"
                size={22}
                color={showSubtitles ? "#6C4EF5" : "#9CA3AF"}
              />
            </TouchableOpacity>
            <Text className="mt-1.5 font-poppins-medium text-[12px] text-[#6B7280]">
              Subtitles
            </Text>
          </View>

          {/* End Call Button */}
          <View className="items-center">
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.endCallButton}
              onPress={handleEndCall}
            >
              <Ionicons name="call" size={22} color="#FFFFFF" style={{ transform: [{ rotate: "135deg" }] }} />
            </TouchableOpacity>
            <Text className="mt-1.5 font-poppins-medium text-[12px] text-[#6B7280]">
              End Call
            </Text>
          </View>
        </View>

        {/* ─── Real-Time Conversation Transcript History ─── */}
        {showSubtitles && liveCaptions.length > 0 && (
          <View style={styles.transcriptSection}>
            <TouchableOpacity
              activeOpacity={0.75}
              style={styles.transcriptHeaderRow}
              onPress={() => setShowTranscriptLog((prev) => !prev)}
            >
              <View className="flex-row items-center">
                <Ionicons name="chatbubbles-outline" size={16} color="#6C4EF5" />
                <Text style={styles.transcriptHeaderTitle}>
                  Live Transcript ({liveCaptions.length})
                </Text>
              </View>
              <View className="flex-row items-center">
                <Text style={styles.transcriptToggleHint}>
                  {showTranscriptLog ? "Hide" : "View History"}
                </Text>
                <Ionicons
                  name={showTranscriptLog ? "chevron-up" : "chevron-down"}
                  size={16}
                  color="#6B7280"
                />
              </View>
            </TouchableOpacity>

            {showTranscriptLog && (
              <View style={styles.transcriptLogList}>
                {liveCaptions.map((item, idx) => (
                  <View
                    key={item.id || idx}
                    style={[
                      styles.transcriptBubble,
                      item.role === "teacher"
                        ? styles.transcriptBubbleTeacher
                        : styles.transcriptBubbleStudent,
                    ]}
                  >
                    <View className="flex-row items-center justify-between mb-1">
                      <Text
                        style={[
                          styles.transcriptSpeakerLabel,
                          item.role === "teacher"
                            ? styles.transcriptLabelTeacher
                            : styles.transcriptLabelStudent,
                        ]}
                      >
                        {item.role === "teacher" ? "🦊 Luna" : `👤 ${userName}`}
                      </Text>
                      <Text style={styles.transcriptTimeLabel}>
                        {new Date(item.timestamp).toLocaleTimeString([], {
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </Text>
                    </View>
                    <Text style={styles.transcriptMessageText}>{item.text}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* ─── Real-Time Lesson Feedback Panel ─── */}
        <View style={styles.feedbackCard}>
          {/* Speaking */}
          <View className="flex-1 items-center">
            <Text className="font-poppins-medium text-[13px] text-[#0D132B]">
              Speaking
            </Text>
            <Text className="mt-1 font-poppins-bold text-[15px] text-[#22C55E]">
              Excellent
            </Text>
          </View>

          <View style={styles.dividerVertical} />

          {/* Pronunciation */}
          <View className="flex-1 items-center">
            <Text className="font-poppins-medium text-[13px] text-[#0D132B]">
              Pronunciation
            </Text>
            <Text className="mt-1 font-poppins-bold text-[15px] text-[#3B82F6]">
              Great
            </Text>
          </View>

          <View style={styles.dividerVertical} />

          {/* Grammar */}
          <View className="flex-1 items-center">
            <Text className="font-poppins-medium text-[13px] text-[#0D132B]">
              Grammar
            </Text>
            <Text className="mt-1 font-poppins-bold text-[15px] text-[#7C3AED]">
              Good
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  stageCard: {
    marginHorizontal: 16,
    marginTop: 12,
    height: 400,
    borderRadius: 24,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#FAF6F0",
    borderWidth: 1,
    borderColor: "#F0ECE6",
    shadowColor: "#0D132B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  roomBackground: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "#F7F3EC",
  },
  shelfDecorative: {
    position: "absolute",
    right: 20,
    top: 50,
    width: 140,
    height: 120,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EBE3D7",
    backgroundColor: "#FAF7F2",
  },
  plantDecorative: {
    position: "absolute",
    left: 20,
    top: 90,
    width: 100,
    height: 140,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EBE3D7",
    backgroundColor: "#FAF7F2",
  },
  mascotContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  mascotTeacher: {
    width: 250,
    height: 250,
  },
  studentCameraInset: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 88,
    height: 114,
    borderRadius: 18,
    borderWidth: 2.5,
    borderColor: "#FFFFFF",
    overflow: "hidden",
    backgroundColor: "#2D3748",
    shadowColor: "#0D132B",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  studentNameOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(13, 19, 43, 0.65)",
    paddingVertical: 2,
    paddingHorizontal: 4,
    alignItems: "center",
  },
  studentNameText: {
    fontFamily: "Poppins-Medium",
    fontSize: 10,
    color: "#FFFFFF",
  },
  sessionBannerTag: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#EEF0F4",
  },
  connectingOverlay: {
    position: "absolute",
    top: 60,
    left: 16,
    right: 16,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E8E0FF",
  },
  errorOverlay: {
    position: "absolute",
    top: 60,
    left: 16,
    right: 16,
    backgroundColor: "rgba(255, 255, 255, 0.96)",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  speechBubbleCard: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEF0F4",
    shadowColor: "#0D132B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  speakerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F4F1FF",
    alignItems: "center",
    justifyContent: "center",
  },
  speakerButtonPlaying: {
    backgroundColor: "#6C4EF5",
  },
  speechTail: {
    position: "absolute",
    bottom: -8,
    right: 50,
    width: 16,
    height: 16,
    backgroundColor: "#FFFFFF",
    transform: [{ rotate: "45deg" }],
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#EEF0F4",
  },
  speakerBadgePill: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  speakerBadgeTeacher: {
    backgroundColor: "#EDE9FE",
  },
  speakerBadgeStudent: {
    backgroundColor: "#DCFCE7",
  },
  speakerEmoji: {
    fontSize: 11,
    marginRight: 4,
  },
  speakerNameText: {
    fontFamily: "Poppins-Bold",
    fontSize: 11,
  },
  speakerTextTeacher: {
    color: "#6C4EF5",
  },
  speakerTextStudent: {
    color: "#15803D",
  },
  liveStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  liveStatusText: {
    fontFamily: "Poppins-Medium",
    fontSize: 10,
    color: "#6B7280",
  },
  captionSpeechText: {
    fontFamily: "Poppins-Bold",
    fontSize: 15,
    lineHeight: 21,
    color: "#0D132B",
  },
  transcriptSection: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: "#EEF0F4",
    shadowColor: "#0D132B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  transcriptHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  transcriptHeaderTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 13,
    color: "#0D132B",
    marginLeft: 6,
  },
  transcriptToggleHint: {
    fontFamily: "Poppins-Medium",
    fontSize: 12,
    color: "#6B7280",
    marginRight: 4,
  },
  transcriptLogList: {
    marginTop: 10,
    gap: 8,
  },
  transcriptBubble: {
    borderRadius: 12,
    padding: 10,
  },
  transcriptBubbleTeacher: {
    backgroundColor: "#F9F8FE",
    borderLeftWidth: 3,
    borderLeftColor: "#6C4EF5",
  },
  transcriptBubbleStudent: {
    backgroundColor: "#F0FDF4",
    borderLeftWidth: 3,
    borderLeftColor: "#22C55E",
  },
  transcriptSpeakerLabel: {
    fontFamily: "Poppins-Bold",
    fontSize: 11,
  },
  transcriptLabelTeacher: {
    color: "#6C4EF5",
  },
  transcriptLabelStudent: {
    color: "#15803D",
  },
  transcriptTimeLabel: {
    fontFamily: "Poppins-Regular",
    fontSize: 10,
    color: "#9CA3AF",
  },
  transcriptMessageText: {
    fontFamily: "Poppins-Medium",
    fontSize: 13,
    lineHeight: 18,
    color: "#1F2937",
  },
  controlButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#EEF0F4",
    shadowColor: "#0D132B",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  controlButtonOff: {
    backgroundColor: "#F4F5F8",
    borderColor: "#E5E7EB",
  },
  controlButtonMuted: {
    backgroundColor: "#FFF2F2",
    borderColor: "#FFD8D8",
  },
  controlButtonActive: {
    backgroundColor: "#F4F1FF",
    borderColor: "#D9D0FF",
  },
  endCallButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#FF4D4F",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FF4D4F",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  feedbackCard: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F0F2F5",
    shadowColor: "#0D132B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  dividerVertical: {
    width: 1,
    height: 36,
    backgroundColor: "#F0F2F5",
  },
  // Agent status pill styles
  agentPill: {
    position: "absolute",
    bottom: 72,
    left: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.93)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#E8E0FF",
  },
  agentPillConnected: {
    borderColor: "#BBF7D0",
    backgroundColor: "rgba(240, 253, 244, 0.95)",
  },
  agentPillFailed: {
    borderColor: "#FDE68A",
    backgroundColor: "rgba(255, 251, 235, 0.95)",
  },
  agentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#22C55E",
    marginRight: 6,
  },
  agentPillText: {
    fontFamily: "Poppins-Medium",
    fontSize: 12,
    color: "#6C4EF5",
  },
});
