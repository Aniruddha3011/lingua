import { useAuth, useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "@/constants/images";
import { useLanguageStore } from "@/store/useLanguageStore";

export default function ProfileTab() {
  const { signOut } = useAuth();
  const { user } = useUser();

  const getSelectedLanguage = useLanguageStore((state) => state.getSelectedLanguage);
  const currentLanguage = getSelectedLanguage();
  const streak = useLanguageStore((state) => state.streak);
  const xp = useLanguageStore((state) => state.xp);
  const completedLessonIds = useLanguageStore((state) => state.completedLessonIds);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [remindersEnabled, setRemindersEnabled] = useState(true);

  const fullName =
    user?.fullName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    "Language Learner";
  const email = user?.primaryEmailAddress?.emailAddress || "learner@example.com";
  const userAvatar =
    user?.imageUrl ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80";

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out of your account?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
            router.replace("/onboarding" as any);
          } catch (err) {
            console.warn("Sign out error:", err);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      {/* ─── Top Header ─── */}
      <View className="h-[52px] flex-row items-center justify-between px-5 border-b border-[#F5F6F8]">
        <Text className="font-poppins-bold text-[20px] text-text-primary">
          Profile
        </Text>
        <TouchableOpacity
          accessibilityLabel="Settings"
          className="size-9 items-center justify-center rounded-full active:bg-[#F6F7FB]"
          onPress={() => Alert.alert("Settings", "App version 1.0.0 (Expo v57)")}
        >
          <Ionicons name="settings-outline" size={20} color="#0D132B" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 110 }}
      >
        {/* ─── User Profile Card ─── */}
        <View style={styles.userCard}>
          <View style={styles.avatarWrap}>
            <Image
              source={{ uri: userAvatar }}
              style={styles.avatarImage}
              resizeMode="cover"
            />
            <View style={styles.proBadge}>
              <Text style={styles.proBadgeText}>PRO</Text>
            </View>
          </View>

          <View className="ml-4 flex-1">
            <Text className="font-poppins-bold text-[18px] text-text-primary" numberOfLines={1}>
              {fullName}
            </Text>
            <Text className="font-poppins text-[12px] text-text-secondary" numberOfLines={1}>
              {email}
            </Text>
            <View className="mt-1 flex-row items-center">
              <View className="size-2 rounded-full bg-[#22C55E] mr-1.5" />
              <Text className="font-poppins-medium text-[11px] text-[#22C55E]">
                Active Learner
              </Text>
            </View>
          </View>
        </View>

        {/* ─── Currently Learning Banner Card ─── */}
        <View style={styles.languageCard}>
          <View className="flex-row items-center flex-1">
            <View style={styles.flagWrap}>
              <Image
                source={{ uri: currentLanguage?.flag }}
                style={{ width: 36, height: 36, borderRadius: 18 }}
                resizeMode="cover"
              />
            </View>
            <View className="ml-3 flex-1">
              <Text className="font-poppins-semibold text-[15px] text-text-primary">
                Learning {currentLanguage?.name || "Spanish"}
              </Text>
              <Text className="font-poppins text-[12px] text-text-secondary">
                Level A1 • Elementary
              </Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.changeLanguageButton}
            onPress={() => router.push("/choose-language")}
          >
            <Text style={styles.changeLanguageText}>Change</Text>
          </TouchableOpacity>
        </View>

        {/* ─── Learning Statistics Grid ─── */}
        <View className="mt-5">
          <Text className="mb-3 font-poppins-bold text-[17px] text-text-primary">
            Statistics
          </Text>

          <View style={styles.statsGrid}>
            {/* Streak */}
            <View style={styles.statBox}>
              <View className="flex-row items-center justify-between w-full">
                <Image source={images.streakFire} style={{ width: 24, height: 24 }} resizeMode="contain" />
                <Text className="font-poppins-bold text-[18px] text-[#FF8A00]">{streak}</Text>
              </View>
              <Text className="mt-2 font-poppins-medium text-[12px] text-text-secondary">Day Streak</Text>
            </View>

            {/* Total XP */}
            <View style={styles.statBox}>
              <View className="flex-row items-center justify-between w-full">
                <Ionicons name="flash" size={24} color="#6C4EF5" />
                <Text className="font-poppins-bold text-[18px] text-brand-purple">{xp}</Text>
              </View>
              <Text className="mt-2 font-poppins-medium text-[12px] text-text-secondary">Total XP</Text>
            </View>

            {/* Completed Lessons */}
            <View style={styles.statBox}>
              <View className="flex-row items-center justify-between w-full">
                <Ionicons name="checkmark-circle" size={24} color="#22C55E" />
                <Text className="font-poppins-bold text-[18px] text-[#22C55E]">
                  {Math.max(completedLessonIds.length, 2)}
                </Text>
              </View>
              <Text className="mt-2 font-poppins-medium text-[12px] text-text-secondary">Lessons Done</Text>
            </View>

            {/* Fluency Score */}
            <View style={styles.statBox}>
              <View className="flex-row items-center justify-between w-full">
                <Ionicons name="ribbon" size={24} color="#3B82F6" />
                <Text className="font-poppins-bold text-[18px] text-[#3B82F6]">85%</Text>
              </View>
              <Text className="mt-2 font-poppins-medium text-[12px] text-text-secondary">Fluency Score</Text>
            </View>
          </View>
        </View>

        {/* ─── Badges & Achievements ─── */}
        <View className="mt-5">
          <Text className="mb-3 font-poppins-bold text-[17px] text-text-primary">
            Achievements
          </Text>

          <View style={styles.achievementsCard}>
            <View style={styles.achievementItem}>
              <View style={[styles.badgeIconWrap, { backgroundColor: "#FEF3C7" }]}>
                <Text style={{ fontSize: 20 }}>🔥</Text>
              </View>
              <View className="ml-3 flex-1">
                <Text className="font-poppins-semibold text-[14px] text-text-primary">Fire Starter</Text>
                <Text className="font-poppins text-[11px] text-text-secondary">Reach a 7-day streak</Text>
              </View>
              <View className="rounded-full bg-[#ECFDF5] px-2 py-0.5">
                <Text className="font-poppins-semibold text-[10px] text-[#059669]">Unlocked</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.achievementItem}>
              <View style={[styles.badgeIconWrap, { backgroundColor: "#EDE9FE" }]}>
                <Text style={{ fontSize: 20 }}>🦊</Text>
              </View>
              <View className="ml-3 flex-1">
                <Text className="font-poppins-semibold text-[14px] text-text-primary">Luna&apos;s Friend</Text>
                <Text className="font-poppins text-[11px] text-text-secondary">Complete an AI voice lesson</Text>
              </View>
              <View className="rounded-full bg-[#ECFDF5] px-2 py-0.5">
                <Text className="font-poppins-semibold text-[10px] text-[#059669]">Unlocked</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.achievementItem}>
              <View style={[styles.badgeIconWrap, { backgroundColor: "#DBEAFE" }]}>
                <Text style={{ fontSize: 20 }}>🏆</Text>
              </View>
              <View className="ml-3 flex-1">
                <Text className="font-poppins-semibold text-[14px] text-text-primary">Top Learner</Text>
                <Text className="font-poppins text-[11px] text-text-secondary">Earn more than 50 XP</Text>
              </View>
              <View className="rounded-full bg-[#F3F4F6] px-2 py-0.5">
                <Text className="font-poppins-semibold text-[10px] text-[#6B7280]">In Progress</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ─── Preferences & Settings ─── */}
        <View className="mt-5">
          <Text className="mb-3 font-poppins-bold text-[17px] text-text-primary">
            Preferences
          </Text>

          <View style={styles.settingsCard}>
            <View style={styles.settingRow}>
              <View className="flex-row items-center">
                <Ionicons name="volume-medium-outline" size={20} color="#6C4EF5" style={{ marginRight: 12 }} />
                <Text className="font-poppins-medium text-[14px] text-text-primary">Sound Effects</Text>
              </View>
              <Switch
                value={soundEnabled}
                onValueChange={setSoundEnabled}
                trackColor={{ false: "#E5E7EB", true: "#6C4EF5" }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View className="flex-row items-center">
                <Ionicons name="notifications-outline" size={20} color="#6C4EF5" style={{ marginRight: 12 }} />
                <Text className="font-poppins-medium text-[14px] text-text-primary">Daily Reminders</Text>
              </View>
              <Switch
                value={remindersEnabled}
                onValueChange={setRemindersEnabled}
                trackColor={{ false: "#E5E7EB", true: "#6C4EF5" }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        {/* ─── Sign Out Button ─── */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.signOutButton}
          onPress={handleSignOut}
        >
          <Ionicons name="log-out-outline" size={18} color="#EF4444" style={{ marginRight: 6 }} />
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EEF0F4",
  },
  avatarWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    position: "relative",
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  proBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#6C4EF5",
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  proBadgeText: {
    fontFamily: "Poppins-Bold",
    fontSize: 9,
    color: "#FFFFFF",
  },
  languageCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#EEF0F4",
  },
  flagWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
  },
  changeLanguageButton: {
    backgroundColor: "#F3F0FF",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  changeLanguageText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 12,
    color: "#6C4EF5",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  statBox: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#EEF0F4",
  },
  achievementsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#EEF0F4",
  },
  achievementItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  badgeIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  settingsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#EEF0F4",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEF2F2",
    borderRadius: 16,
    paddingVertical: 14,
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#FEE2E2",
  },
  signOutButtonText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: "#EF4444",
  },
});
