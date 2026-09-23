import { Ionicons } from "@expo/vector-icons";
import { Image as ExpoImage } from "expo-image";
import { Redirect, router, type Href } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "@/constants/images";
import { getLessonsByLanguage } from "@/data/lessons";
import { getUnitsByLanguage } from "@/data/units";
import { useLanguageStore } from "@/store/useLanguageStore";
import type { Lesson } from "@/types/learning";

type LessonStatus = "completed" | "in-progress" | "locked";

function getLessonStatus(index: number): LessonStatus {
  if (index < 2) return "completed";
  if (index === 2) return "in-progress";
  return "locked";
}

function getLessonAssetThumbnail(index: number) {
  const localThumbnails = [
    images.mascotLogo,
    images.mascotAuth,
    images.palace,
    images.treasure,
    images.earth,
    images.mascotWelcome,
  ];
  return localThumbnails[index % localThumbnails.length];
}

function LessonCard({ lesson, index }: { lesson: Lesson; index: number }) {
  const status = getLessonStatus(index);
  const isInProgress = status === "in-progress";
  const isCompleted = status === "completed";

  const openLesson = () => {
    router.push(`/lesson/${lesson.id}` as Href);
  };

  const thumbnailAsset = getLessonAssetThumbnail(index);

  return (
    <TouchableOpacity
      accessibilityHint="Opens this lesson"
      accessibilityLabel={`Lesson ${index + 1}: ${lesson.title}`}
      activeOpacity={0.85}
      style={[
        styles.lessonCard,
        isInProgress ? styles.inProgressCard : styles.standardCard,
      ]}
      onPress={openLesson}
    >
      <View className="flex-1 pr-3">
        <Text
          className={`font-poppins-medium text-[12px] ${
            isInProgress ? "text-[#7C3AED] font-poppins-semibold" : "text-[#8E95A5]"
          }`}
        >
          Lesson {index + 1}
        </Text>
        <Text
          className="mt-0.5 font-poppins-semibold text-[15px] leading-[20px] text-text-primary"
          numberOfLines={1}
        >
          {lesson.title}
        </Text>

        {isInProgress ? (
          <Text className="mt-0.5 font-poppins-medium text-[12px] text-[#7C3AED]">
            In progress
          </Text>
        ) : !isCompleted ? (
          <Text className="mt-0.5 font-poppins text-[12px] text-[#9CA3AF]">
            0 / 6 lessons
          </Text>
        ) : null}
      </View>

      {/* Status icon or Lesson Thumbnail from assets */}
      {isCompleted ? (
        <View style={styles.completedIcon}>
          <Ionicons name="checkmark" size={16} color="#FFFFFF" />
        </View>
      ) : isInProgress ? (
        <View style={styles.inProgressImageWrap}>
          <Image
            source={thumbnailAsset}
            style={styles.thumbnailImage}
            resizeMode="cover"
          />
        </View>
      ) : (
        <View style={styles.lockedIconWrap}>
          <Ionicons name="lock-closed-outline" size={18} color="#8E95A5" />
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function LearnTab() {
  const [activeTab, setActiveTab] = useState<"lessons" | "practice">("lessons");
  const selectedLanguageId = useLanguageStore((state) => state.selectedLanguageId);
  const getSelectedLanguage = useLanguageStore((state) => state.getSelectedLanguage);
  const hasHydrated = useLanguageStore((state) => state.hasHydrated);

  const language = getSelectedLanguage();
  const units = language ? getUnitsByLanguage(language.id) : [];
  const lessons = language ? getLessonsByLanguage(language.id) : [];
  const currentUnit = units[0];

  if (!hasHydrated) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#FFFFFF" }}>
        <ActivityIndicator size="large" color="#6C4EF5" />
      </View>
    );
  }

  if (!selectedLanguageId || !language) {
    return <Redirect href="/choose-language" />;
  }

  const headerTitle = lessons[2]?.title ?? currentUnit?.title ?? "At the Café";
  const unitNumber = currentUnit?.unitNumber ?? 3;
  const completedCount = 3;
  const totalCount = Math.max(lessons.length, 6);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      {/* ─── Header Bar ─── */}
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
            {headerTitle}
          </Text>
          <Text className="font-poppins text-[13px] leading-[17px] text-[#6B7280]">
            Unit {unitNumber} • {completedCount} / {totalCount} lessons
          </Text>
        </View>

        <TouchableOpacity accessibilityLabel="Bookmark unit" className="size-9 items-center justify-center">
          <View style={styles.bookmarkBadge}>
            <Ionicons name="bookmark" size={16} color="#FF9D00" />
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Top Hero Illustration Banner (Composed from Assets: palace, mascotWelcome, earth) ─── */}
        <View style={styles.heroBanner}>
          {/* Background Earth graphic */}
          <Image
            source={images.earth}
            style={styles.earthBackground}
            resizeMode="contain"
          />

          {/* Palace illustration on the right */}
          <Image
            source={images.palace}
            style={styles.palaceIllustration}
            resizeMode="contain"
          />

          {/* Mascot Fox illustration on the left */}
          <Image
            source={images.mascotWelcome}
            style={styles.mascotIllustration}
            resizeMode="contain"
          />

          {/* Language tag badge */}
          <View className="absolute right-4 top-3 rounded-full bg-white/90 px-3 py-1 border border-[#E5E7EB] shadow-sm">
            <Text className="font-poppins-semibold text-[12px] text-brand-purple">
              {language.name}
            </Text>
          </View>
        </View>

        {/* ─── Segmented Control Tab Bar ("Lessons" | "Practice") ─── */}
        <View style={styles.segmentedContainer}>
          {(["lessons", "practice"] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
                style={[
                  styles.segmentedTab,
                  isActive && styles.segmentedTabActive,
                ]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  className={`font-poppins-semibold text-[15px] ${
                    isActive ? "text-[#6C4EF5]" : "text-[#6B7280]"
                  }`}
                >
                  {tab === "lessons" ? "Lessons" : "Practice"}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ─── Lessons List ─── */}
        <View className="px-4 pt-4 gap-3">
          {activeTab === "lessons" ? (
            lessons.map((lesson, index) => (
              <LessonCard key={lesson.id} lesson={lesson} index={index} />
            ))
          ) : (
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.practiceCard}
              onPress={() => router.push(`/lesson/${lessons[0]?.id}` as Href)}
            >
              <Text className="font-poppins-bold text-[18px] text-text-primary">
                Quick practice
              </Text>
              <Text className="mt-1 font-poppins text-[14px] leading-[20px] text-text-secondary">
                Review today&apos;s words and strengthen your {language.name} skills.
              </Text>
              <View className="mt-3 self-start rounded-xl bg-brand-purple px-4 py-2">
                <Text className="font-poppins-semibold text-[14px] text-white">
                  Start practice
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  heroBanner: {
    height: 180,
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#EAF5FF",
  },
  earthBackground: {
    position: "absolute",
    bottom: -30,
    left: -40,
    width: 380,
    height: 200,
    opacity: 0.35,
  },
  palaceIllustration: {
    position: "absolute",
    right: -10,
    bottom: 0,
    width: 175,
    height: 175,
  },
  mascotIllustration: {
    position: "absolute",
    left: 8,
    bottom: -15,
    width: 145,
    height: 155,
  },
  segmentedContainer: {
    flexDirection: "row",
    height: 46,
    marginHorizontal: 16,
    marginTop: -22,
    backgroundColor: "#F2F3F7",
    borderRadius: 23,
    padding: 3,
    shadowColor: "#0D132B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  segmentedTab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  segmentedTabActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#0D132B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  lessonCard: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
  },
  standardCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#EEF0F4",
    shadowColor: "#0D132B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  inProgressCard: {
    backgroundColor: "#F9F8FF",
    borderColor: "#7C3AED",
    borderWidth: 1.5,
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  completedIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#22C55E",
    alignItems: "center",
    justifyContent: "center",
  },
  inProgressImageWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
  },
  lockedIconWrap: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  bookmarkBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFF8EC",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FFE5B4",
  },
  practiceCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E8E0FF",
    backgroundColor: "#FBF9FF",
    padding: 16,
  },
});
