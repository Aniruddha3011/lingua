import { useAuth, useUser } from "@clerk/expo";
import { Redirect, router } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
  const streak = useLanguageStore((state) => state.streak);
  const xp = useLanguageStore((state) => state.xp);

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

  // Streak & XP derived values
  const streakCount = streak || 12;
  const currentXP = xp || 25;
  const goalXP = 50;
  const xpProgress = Math.min(1, currentXP / goalXP);

  const handlePlanItemPress = (item: typeof TODAY_PLAN[0]) => {
    if (item.id === "tp-1") {
      router.push(`/lesson/${currentLesson?.id || "es-1-1"}` as any);
    } else if (item.id === "tp-2") {
      router.push("/(tabs)/ai-teacher" as any);
    } else {
      router.push("/(tabs)/learn" as any);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ─── Header ─── */}
        <View className="flex-row items-center px-5 pt-2 pb-4">
          {/* Flag avatar - Tap to change language */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.flagAvatar}
            onPress={() => router.push("/choose-language")}
          >
            <Image
              source={{ uri: currentLanguage?.flag }}
              style={{ width: 36, height: 36, borderRadius: 18 }}
              resizeMode="cover"
            />
          </TouchableOpacity>

          {/* Greeting */}
          <Text className="flex-1 ml-3 font-poppins-bold text-[20px] text-text-primary" numberOfLines={1}>
            {greeting}
          </Text>

          {/* Streak - Tap for streak details */}
          <TouchableOpacity
            activeOpacity={0.7}
            className="flex-row items-center mr-3"
            onPress={() =>
              Alert.alert(
                "🔥 " + streakCount + " Day Streak!",
                "You are doing awesome! Practice daily with Luna to build your streak and stay fluent."
              )
            }
          >
            <Image source={images.streakFire} style={{ width: 22, height: 22 }} resizeMode="contain" />
            <Text className="ml-1 font-poppins-bold text-[16px] text-[#FF8A00]">{streakCount}</Text>
          </TouchableOpacity>

          {/* Bell - Notifications */}
          <TouchableOpacity
            style={styles.bellButton}
            activeOpacity={0.7}
            onPress={() =>
              Alert.alert(
                "Notifications",
                "You're all caught up! Time for your daily practice session with Luna."
              )
            }
          >
            <Text style={{ fontSize: 20 }}>🔔</Text>
          </TouchableOpacity>
        </View>

        <View className="px-5 gap-4">
          {/* ─── Daily Goal Card ─── */}
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.goalCard}
            onPress={() => router.push("/(tabs)/learn")}
          >
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
          </TouchableOpacity>

          {/* ─── Continue Learning Card ─── */}
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.continueCard}
            onPress={() =>
              currentLesson
                ? router.push(`/lesson/${currentLesson.id}` as any)
                : router.push("/(tabs)/learn")
            }
          >
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
                <View style={styles.continueButton}>
                  <Text className="font-poppins-semibold text-[15px] text-brand-purple">
                    Continue Lesson
                  </Text>
                </View>
              </View>
              {/* Palace image */}
              <Image
                source={images.palace}
                style={styles.palaceImage}
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity>

          {/* ─── Today's Plan ─── */}
          <View>
            <View className="flex-row items-center justify-between mb-3">
              <Text className="font-poppins-bold text-[17px] text-text-primary">Today&apos;s plan</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.push("/(tabs)/learn")}
              >
                <Text className="font-poppins-semibold text-[14px] text-brand-purple">View all</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.planCard}>
              {TODAY_PLAN.map((item, index) => (
                <View key={item.id}>
                  <TouchableOpacity
                    activeOpacity={0.75}
                    className="flex-row items-center py-3"
                    onPress={() => handlePlanItemPress(item)}
                  >
                    {/* Icon box */}
                    <View style={[styles.planIcon, { backgroundColor: item.color }]}>
                      <Text style={{ fontSize: 18 }}>{item.icon}</Text>
                    </View>

                    {/* Text */}
                    <View className="flex-1 ml-3">
                      <Text className="font-poppins-semibold text-[15px] text-text-primary">{item.title}</Text>
                      <Text className="font-poppins text-[13px] text-text-secondary">{item.subtitle}</Text>
                    </View>

                    {/* Check / Arrow */}
                    {item.done ? (
                      <View style={styles.checkCircle}>
                        <Text style={{ color: "#fff", fontSize: 13 }}>✓</Text>
                      </View>
                    ) : (
                      <View style={styles.startBadge}>
                        <Text style={{ color: "#6C4EF5", fontSize: 11, fontFamily: "Poppins-SemiBold" }}>
                          Start ›
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                  {index < TODAY_PLAN.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </View>
          </View>

          {/* ─── Next Up Card ─── */}
          <TouchableOpacity
            activeOpacity={0.88}
            style={styles.nextUpCard}
            onPress={() =>
              router.push(
                `/lesson/${currentLesson?.id || "es-1-1"}` as any
              )
            }
          >
            <View className="flex-1">
              <Text className="font-poppins text-[12px] text-text-secondary mb-0.5">Next up</Text>
              <Text className="font-poppins-bold text-[18px] text-text-primary">AI Video Call</Text>
              <Text className="font-poppins text-[13px] text-text-secondary">Practice speaking with Luna</Text>
            </View>

            {/* Teacher avatar */}
            <View style={styles.teacherAvatarWrap}>
              <Image
                source={images.mascotLogo}
                style={{ width: 44, height: 44 }}
                resizeMode="contain"
              />
            </View>

            {/* Video call button */}
            <View style={styles.videoButton}>
              <Text style={{ fontSize: 22 }}>📹</Text>
            </View>
          </TouchableOpacity>

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
  startBadge: {
    backgroundColor: "#F5F3FF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
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
