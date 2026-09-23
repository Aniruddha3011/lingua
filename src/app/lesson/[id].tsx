import { Ionicons } from "@expo/vector-icons";
import { Image as ExpoImage } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "@/constants/images";
import { getLessonById } from "@/data/lessons";
import { getLanguageById } from "@/data/languages";

const DEFAULT_PHRASES: Record<string, { phrase: string; translation: string }> = {
  spanish: { phrase: "¡Muy bien!", translation: "That was great! 👏" },
  french: { phrase: "C'est très bien !", translation: "Wonderful job! 👏" },
  german: { phrase: "Sehr gut!", translation: "That was excellent! 👏" },
  japanese: { phrase: "すばらしい！", translation: "Great job! 👏" },
  korean: { phrase: "아주 잘했어요!", translation: "Great work! 👏" },
  chinese: { phrase: "太棒了！", translation: "Awesome job! 👏" },
  italian: { phrase: "Molto bene!", translation: "That was great! 👏" },
};

export default function AITeacherAudioLessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lesson = id ? getLessonById(id) : undefined;
  const language = lesson ? getLanguageById(lesson.languageId) : undefined;

  // Interactive session control states
  const [isMicActive, setIsMicActive] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Lesson phrase selection
  const languageKey = lesson?.languageId ?? "spanish";
  const defaultPhrase = DEFAULT_PHRASES[languageKey] ?? DEFAULT_PHRASES.spanish;

  const currentPhrase = lesson?.phrases && lesson.phrases.length > 0
    ? {
        phrase: lesson.phrases[phraseIndex % lesson.phrases.length].text,
        translation: lesson.phrases[phraseIndex % lesson.phrases.length].translation,
      }
    : defaultPhrase;

  // Next phrase trigger
  const handlePlaySound = () => {
    setIsPlayingAudio(true);
    setTimeout(() => {
      setIsPlayingAudio(false);
      setPhraseIndex((prev) => prev + 1);
    }, 1200);
  };

  const handleEndCall = () => {
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      {/* ─── Top Header Bar ─── */}
      <View className="h-[52px] flex-row items-center px-4 border-b border-[#F5F6F8]">
        <TouchableOpacity
          accessibilityLabel="Go back"
          className="mr-3 size-9 items-center justify-center rounded-full active:bg-[#F5F6F8]"
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#0D132B" />
        </TouchableOpacity>

        <View className="flex-1">
          <Text className="font-poppins-bold text-[18px] leading-[23px] text-text-primary" numberOfLines={1}>
            AI Teacher
          </Text>
          <View className="flex-row items-center mt-0.5">
            <View className="mr-1.5 size-2 rounded-full bg-[#22C55E]" />
            <Text className="font-poppins-medium text-[12px] text-[#22C55E]">
              Online
            </Text>
          </View>
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
        {/* ─── Main Stage Area (Teacher & Camera Call View) ─── */}
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
                source={{ uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80" }}
                style={StyleSheet.absoluteFill}
                contentFit="cover"
              />
            ) : (
              <View className="size-full items-center justify-center bg-[#2D3748]">
                <Ionicons name="videocam-off-outline" size={24} color="#A0AEC0" />
              </View>
            )}
          </View>

          {/* Teacher Response Speech Bubble */}
          {showSubtitles && (
            <View style={styles.speechBubbleCard}>
              <View className="flex-1 pr-3">
                <Text className="font-poppins-bold text-[17px] leading-[22px] text-[#0D132B]">
                  {currentPhrase.phrase}
                </Text>
                <Text className="mt-1 font-poppins-medium text-[14px] leading-[19px] text-[#4B5563]">
                  {currentPhrase.translation}
                </Text>
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
        <View className="mt-2 flex-row items-center justify-around px-5">
          {/* Camera Button */}
          <View className="items-center">
            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.controlButton,
                !isCameraActive && styles.controlButtonOff,
              ]}
              onPress={() => setIsCameraActive((prev) => !prev)}
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

          {/* Mic Button */}
          <View className="items-center">
            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.controlButton,
                !isMicActive && styles.controlButtonMuted,
              ]}
              onPress={() => setIsMicActive((prev) => !prev)}
            >
              <Ionicons
                name={isMicActive ? "mic" : "mic-off"}
                size={22}
                color={isMicActive ? "#0D132B" : "#FF4D4F"}
              />
            </TouchableOpacity>
            <Text className="mt-1.5 font-poppins-medium text-[12px] text-[#6B7280]">
              Mic
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
              onPress={() => setShowSubtitles((prev) => !prev)}
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
});
