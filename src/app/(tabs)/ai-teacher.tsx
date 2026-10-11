import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "@/constants/images";
import { getLessonsByLanguage } from "@/data/lessons";
import { useLanguageStore } from "@/store/useLanguageStore";

const PRACTICE_SCENARIOS = [
  {
    id: "scenario-cafe",
    title: "At the Café",
    description: "Order drinks, pastries, and practice polite conversation.",
    level: "A1 • Beginner",
    duration: "3 mins",
    icon: "cafe",
    color: "#6C4EF5",
    lessonIndex: 0,
  },
  {
    id: "scenario-daily",
    title: "Daily Conversation",
    description: "Introduce yourself, talk about your hobbies and daily routine.",
    level: "A1 • Beginner",
    duration: "4 mins",
    icon: "chatbubbles",
    color: "#22C55E",
    lessonIndex: 1,
  },
  {
    id: "scenario-travel",
    title: "Travel & Directions",
    description: "Ask for train tickets, directions, and hotel check-in phrases.",
    level: "A2 • Elementary",
    duration: "5 mins",
    icon: "compass",
    color: "#3B82F6",
    lessonIndex: 2,
  },
  {
    id: "scenario-market",
    title: "Shopping & Market",
    description: "Ask for prices, sizes, and bargain with local vendors.",
    level: "A2 • Elementary",
    duration: "4 mins",
    icon: "cart",
    color: "#F59E0B",
    lessonIndex: 3,
  },
];

export default function AITeacherTab() {
  const getSelectedLanguage = useLanguageStore((state) => state.getSelectedLanguage);
  const currentLanguage = getSelectedLanguage();
  const lessons = currentLanguage ? getLessonsByLanguage(currentLanguage.id) : [];
  const defaultLessonId = lessons[0]?.id || "es-1-1";

  const [activeMode, setActiveMode] = useState<"voice" | "chat">("voice");

  const startVoiceLesson = (lessonId: string = defaultLessonId) => {
    router.push(`/lesson/${lessonId}` as any);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      {/* ─── Top Header ─── */}
      <View className="h-[52px] flex-row items-center justify-between px-5 border-b border-[#F5F6F8]">
        <View className="flex-row items-center">
          <View style={styles.flagBadge}>
            <Image
              source={{ uri: currentLanguage?.flag }}
              style={{ width: 28, height: 28, borderRadius: 14 }}
              resizeMode="cover"
            />
          </View>
          <View className="ml-2.5">
            <Text className="font-poppins-bold text-[18px] text-text-primary">
              AI Teacher
            </Text>
            <Text className="font-poppins text-[11px] text-[#6B7280]">
              {currentLanguage?.name || "Spanish"} Tutor
            </Text>
          </View>
        </View>

        {/* Change language quick button */}
        <TouchableOpacity
          activeOpacity={0.7}
          className="flex-row items-center rounded-full bg-[#F6F7FB] px-3 py-1.5"
          onPress={() => router.push("/choose-language")}
        >
          <Ionicons name="globe-outline" size={15} color="#6C4EF5" />
          <Text className="ml-1.5 font-poppins-semibold text-[12px] text-brand-purple">
            Switch
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 110 }}
      >
        {/* ─── Luna Hero Stage Card ─── */}
        <View style={styles.teacherHeroCard}>
          {/* Background Ambient circles */}
          <View style={styles.ambientCircle} />

          {/* Online badge */}
          <View style={styles.onlineBadge}>
            <View style={styles.pulsingDot} />
            <Text style={styles.onlineBadgeText}>Luna is ready to speak</Text>
          </View>

          {/* Mascot Teacher Image */}
          <View style={styles.mascotContainer}>
            <Image
              source={images.mascotWelcome}
              style={styles.mascotImage}
              resizeMode="contain"
            />
          </View>

          {/* Teacher Info */}
          <View className="items-center px-4 mt-2">
            <Text className="font-poppins-bold text-[24px] text-white">
              Luna • Your AI Tutor
            </Text>
            <Text className="mt-1 text-center font-poppins text-[13px] leading-[19px] text-white/90">
              Practice real-time speech, receive live pronunciation tips, and build conversational confidence.
            </Text>
          </View>

          {/* Primary Call to Action Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.startVoiceButton}
            onPress={() => startVoiceLesson(defaultLessonId)}
          >
            <Ionicons name="mic" size={20} color="#6C4EF5" style={{ marginRight: 8 }} />
            <Text style={styles.startVoiceButtonText}>
              Start Voice Conversation
            </Text>
          </TouchableOpacity>
        </View>

        {/* ─── Mode Switcher (Voice Lesson vs Chat Tutor) ─── */}
        <View style={styles.modeSwitcherContainer}>
          <TouchableOpacity
            style={[
              styles.modeTabButton,
              activeMode === "voice" && styles.modeTabActive,
            ]}
            onPress={() => setActiveMode("voice")}
          >
            <Ionicons
              name="headset"
              size={17}
              color={activeMode === "voice" ? "#6C4EF5" : "#6B7280"}
            />
            <Text
              style={[
                styles.modeTabText,
                activeMode === "voice" && styles.modeTabTextActive,
              ]}
            >
              Voice Sessions
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modeTabButton,
              activeMode === "chat" && styles.modeTabActive,
            ]}
            onPress={() => router.push("/(tabs)/chat")}
          >
            <Ionicons
              name="chatbubble-ellipses"
              size={17}
              color={activeMode === "chat" ? "#6C4EF5" : "#6B7280"}
            />
            <Text
              style={[
                styles.modeTabText,
                activeMode === "chat" && styles.modeTabTextActive,
              ]}
            >
              Text Chat Tutor
            </Text>
          </TouchableOpacity>
        </View>

        {/* ─── Speaking Performance Metrics Bar ─── */}
        <View style={styles.metricsCard}>
          <View className="flex-1 items-center">
            <Text className="font-poppins-bold text-[18px] text-[#6C4EF5]">24m</Text>
            <Text className="font-poppins text-[11px] text-[#6B7280]">Speaking Time</Text>
          </View>
          <View style={styles.metricsDivider} />
          <View className="flex-1 items-center">
            <Text className="font-poppins-bold text-[18px] text-[#22C55E]">92%</Text>
            <Text className="font-poppins text-[11px] text-[#6B7280]">Pronunciation</Text>
          </View>
          <View style={styles.metricsDivider} />
          <View className="flex-1 items-center">
            <Text className="font-poppins-bold text-[18px] text-[#F59E0B]">4/6</Text>
            <Text className="font-poppins text-[11px] text-[#6B7280]">Topics Mastered</Text>
          </View>
        </View>

        {/* ─── Practice Scenarios List ─── */}
        <View className="mt-5">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="font-poppins-bold text-[17px] text-text-primary">
              Choose a Conversation Topic
            </Text>
            <Text className="font-poppins text-[12px] text-[#6C4EF5]">
              {PRACTICE_SCENARIOS.length} Topics
            </Text>
          </View>

          <View className="gap-3">
            {PRACTICE_SCENARIOS.map((scenario) => {
              const targetLesson =
                lessons[scenario.lessonIndex] || lessons[0];
              const lessonId = targetLesson?.id || defaultLessonId;

              return (
                <TouchableOpacity
                  key={scenario.id}
                  activeOpacity={0.8}
                  style={styles.scenarioCard}
                  onPress={() => startVoiceLesson(lessonId)}
                >
                  <View
                    style={[
                      styles.scenarioIconWrap,
                      { backgroundColor: scenario.color + "15" },
                    ]}
                  >
                    <Ionicons
                      name={scenario.icon as any}
                      size={24}
                      color={scenario.color}
                    />
                  </View>

                  <View className="flex-1 ml-3.5 pr-2">
                    <View className="flex-row items-center justify-between">
                      <Text className="font-poppins-semibold text-[15px] text-text-primary">
                        {scenario.title}
                      </Text>
                      <View className="rounded-full bg-[#F3F4F6] px-2 py-0.5">
                        <Text className="font-poppins-medium text-[10px] text-[#6B7280]">
                          {scenario.duration}
                        </Text>
                      </View>
                    </View>
                    <Text
                      className="mt-0.5 font-poppins text-[12px] leading-[17px] text-text-secondary"
                      numberOfLines={2}
                    >
                      {scenario.description}
                    </Text>
                    <Text className="mt-1 font-poppins-medium text-[11px] text-[#6C4EF5]">
                      {scenario.level}
                    </Text>
                  </View>

                  <View style={styles.startArrowBadge}>
                    <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flagBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
  },
  teacherHeroCard: {
    backgroundColor: "#6C4EF5",
    borderRadius: 24,
    paddingVertical: 20,
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
    shadowColor: "#6C4EF5",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  ambientCircle: {
    position: "absolute",
    top: -50,
    right: -50,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
  },
  onlineBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 6,
  },
  pulsingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#22C55E",
    marginRight: 6,
  },
  onlineBadgeText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 12,
    color: "#FFFFFF",
  },
  mascotContainer: {
    width: 140,
    height: 140,
    alignItems: "center",
    justifyContent: "center",
  },
  mascotImage: {
    width: 140,
    height: 140,
  },
  startVoiceButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 13,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  startVoiceButtonText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 15,
    color: "#6C4EF5",
  },
  modeSwitcherContainer: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    padding: 4,
    marginTop: 16,
  },
  modeTabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  modeTabActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#0D132B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  modeTabText: {
    fontFamily: "Poppins-Medium",
    fontSize: 13,
    color: "#6B7280",
  },
  modeTabTextActive: {
    fontFamily: "Poppins-SemiBold",
    color: "#6C4EF5",
  },
  metricsCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#EEF0F4",
  },
  metricsDivider: {
    width: 1,
    height: 28,
    backgroundColor: "#E5E7EB",
  },
  scenarioCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#EEF0F4",
    shadowColor: "#0D132B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  scenarioIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  startArrowBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#6C4EF5",
    alignItems: "center",
    justifyContent: "center",
  },
});
