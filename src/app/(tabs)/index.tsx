import { useAuth, useUser } from "@clerk/expo";
import { Redirect, router } from "expo-router";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "@/constants/images";
import { getLessonsByUnit } from "@/data/lessons";
import { getUnitsByLanguage } from "@/data/units";
import { useLanguageStore } from "@/store/useLanguageStore";

// Today's plan items — static for now, maps to lesson types
const TODAY_PLAN = [
  { id: "tp-1", title: "Lesson", subtitle: "At the café", icon: "📖", color: "#6C4EF5", done: true },
  { id: "tp-2", title: "AI Conversation", subtitle: "Talk about your day", icon: "🎧", color: "#4D8BFF", done: false },
  { id: "tp-3", title: "New words", subtitle: "10 words", icon: "💬", color: "#FF4D4F", done: false },
];

export default function HomeTab() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const selectedLanguageId = useLanguageStore((state) => state.selectedLanguageId);
  const getSelectedLanguage = useLanguageStore((state) => state.getSelectedLanguage);
  const hasHydrated = useLanguageStore((state) => state.hasHydrated);

  const currentLanguage = getSelectedLanguage();

  if (!isLoaded || !hasHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFFFFF" }}>
        <ActivityIndicator size="large" color="#6C4EF5" />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href="/onboarding" />;
  }

  if (!selectedLanguageId) {
    return <Redirect href="/choose-language" />;
  }

  // Derive data from selected language
  const units = currentLanguage ? getUnitsByLanguage(currentLanguage.id) : [];
  const currentUnit = units[0];
  const lessons = currentUnit ? getLessonsByUnit(currentUnit.id) : [];
  const currentLesson = lessons[0];

  // Greeting based on user's first name
  const firstName = user?.firstName ?? user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] ?? "there";
  const greeting = `Hola, ${firstName}! 👋`;

  // Streak XP (hardcoded for now)
  const streakCount = 12;
  const currentXP = 15;
  const goalXP = 20;
  const xpProgress = currentXP / goalXP;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ─── Header ─── */}
        <View className="flex-row items-center px-5 pt-2 pb-4">
          {/* Flag avatar */}
          <View style={styles.flagAvatar}>
            <Image
              source={{ uri: currentLanguage?.flag }}
              style={{ width: 36, height: 36, borderRadius: 18 }}
              resizeMode="cover"
            />
          </View>

          {/* Greeting */}
          <Text className="flex-1 ml-3 font-poppins-bold text-[20px] text-text-primary" numberOfLines={1}>
            {greeting}
          </Text>

          {/* Streak */}
          <View className="flex-row items-center mr-3">
            <Image source={images.streakFire} style={{ width: 22, height: 22 }} resizeMode="contain" />
            <Text className="ml-1 font-poppins-bold text-[16px] text-[#FF8A00]">{streakCount}</Text>
          </View>

          {/* Bell */}
          <TouchableOpacity style={styles.bellButton} activeOpacity={0.7}>
            <Text style={{ fontSize: 20 }}>🔔</Text>
          </TouchableOpacity>
        </View>

        <View className="px-5 gap-4">
          {/* ─── Daily Goal Card ─── */}
          <View style={styles.goalCard}>
            <View className="flex-1">
              <Text className="font-poppins text-[13px] text-text-secondary mb-1">Daily goal</Text>
              <Text className="font-poppins-bold text-[28px] text-text-primary leading-[34px]">
                {currentXP}{" "}
                <Text className="font-poppins text-[18px] text-text-secondary">/ {goalXP} XP</Text>
              </Text>
              {/* Progress bar */}
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${xpProgress * 100}%` }]} />
              </View>
            </View>
            <Image
              source={images.treasure}
              style={{ width: 80, height: 80, marginLeft: 8 }}
              resizeMode="contain"
            />
          </View>

          {/* ─── Continue Learning Card ─── */}
          <View style={styles.continueCard}>
            {/* Gradient overlay using nested views */}
            <View style={styles.continueCardInner}>
              <View className="flex-1 pr-2">
                <Text className="font-poppins text-[13px] text-white opacity-80 mb-1">Continue learning</Text>
                <Text className="font-poppins-bold text-[28px] text-white leading-[34px]">
                  {currentLanguage?.name}
                </Text>
                <Text className="font-poppins text-[14px] text-white opacity-70 mt-1 mb-4">
                  A1 • {currentUnit ? `Unit ${currentUnit.unitNumber}` : "Unit 1"}
                </Text>
                <TouchableOpacity
                  style={styles.continueButton}
                  activeOpacity={0.85}
                  disabled={!currentLesson}
                  onPress={currentLesson ? () => router.push("/(tabs)/learn") : undefined}
                >
                  <Text className="font-poppins-semibold text-[15px] text-brand-purple">Continue</Text>
                </TouchableOpacity>
              </View>
              {/* Palace image */}
              <Image
                source={images.palace}
                style={styles.palaceImage}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* ─── Today's Plan ─── */}
          <View>
            <View className="flex-row items-center justify-between mb-3">
              <Text className="font-poppins-bold text-[17px] text-text-primary">Today&apos;s plan</Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text className="font-poppins-semibold text-[14px] text-brand-purple">View all</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.planCard}>
              {TODAY_PLAN.map((item, index) => (
                <View key={item.id}>
                  <View className="flex-row items-center py-3">
                    {/* Icon box */}
                    <View style={[styles.planIcon, { backgroundColor: item.color }]}>
                      <Text style={{ fontSize: 18 }}>{item.icon}</Text>
                    </View>

                    {/* Text */}
                    <View className="flex-1 ml-3">
                      <Text className="font-poppins-semibold text-[15px] text-text-primary">{item.title}</Text>
                      <Text className="font-poppins text-[13px] text-text-secondary">{item.subtitle}</Text>
                    </View>

                    {/* Check / Circle */}
                    {item.done ? (
                      <View style={styles.checkCircle}>
                        <Text style={{ color: "#fff", fontSize: 13 }}>✓</Text>
                      </View>
                    ) : (
                      <View style={styles.emptyCircle} />
                    )}
                  </View>
                  {index < TODAY_PLAN.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </View>
          </View>

          {/* ─── Next Up Card ─── */}
          <View style={styles.nextUpCard}>
            <View className="flex-1">
              <Text className="font-poppins text-[12px] text-text-secondary mb-0.5">Next up</Text>
              <Text className="font-poppins-bold text-[18px] text-text-primary">AI Video Call</Text>
              <Text className="font-poppins text-[13px] text-text-secondary">Practice speaking</Text>
            </View>

            {/* Teacher avatar */}
            <View style={styles.teacherAvatarWrap}>
              <Image
                source={{ uri: "https://i.pravatar.cc/150?img=47" }}
                style={styles.teacherAvatar}
              />
            </View>

            {/* Video call button */}
            <TouchableOpacity style={styles.videoButton} activeOpacity={0.85}>
              <Text style={{ fontSize: 22 }}>📹</Text>
            </TouchableOpacity>
          </View>

          {/* bottom padding for tab bar */}
          <View style={{ height: 16 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 24,
  },
  flagAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    backgroundColor: "#F6F7FB",
  },
  bellButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F6F7FB",
    alignItems: "center",
    justifyContent: "center",
  },
  goalCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8EE",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#FFE5B4",
  },
  progressTrack: {
    marginTop: 12,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFE0A0",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: "#FF8A00",
  },
  continueCard: {
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#6C4EF5",
  },
  continueCardInner: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 20,
    paddingBottom: 20,
    paddingRight: 0,
    minHeight: 170,
  },
  continueButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 10,
    alignSelf: "flex-start",
  },
  palaceImage: {
    width: 140,
    height: 140,
    marginBottom: -4,
  },
  planCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
  },
  planIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#6C4EF5",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#D1D5DB",
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginLeft: 56,
  },
  nextUpCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FAF0",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#C6EFC8",
  },
  teacherAvatarWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: "hidden",
    marginRight: 12,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  teacherAvatar: {
    width: 56,
    height: 56,
  },
  videoButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#21C16B",
    alignItems: "center",
    justifyContent: "center",
  },
});
