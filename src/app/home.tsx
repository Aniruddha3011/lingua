import { useAuth } from "@clerk/expo";
import { Link, Redirect } from "expo-router";
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from "react-native";

import { useLanguageStore } from "@/store/useLanguageStore";

export default function Home() {
  const { isSignedIn, isLoaded, signOut } = useAuth();
  const selectedLanguageId = useLanguageStore((state) => state.selectedLanguageId);
  const getSelectedLanguage = useLanguageStore((state) => state.getSelectedLanguage);
  const clearSelectedLanguage = useLanguageStore((state) => state.clearSelectedLanguage);
  const hasHydrated = useLanguageStore((state) => state.hasHydrated);

  const currentLanguage = getSelectedLanguage();

  if (!isLoaded || !hasHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFFFFF" }}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href="/onboarding" />;
  }

  if (!selectedLanguageId) {
    return <Redirect href="/choose-language" />;
  }

  return (
    <View className="ds-screen justify-center px-6">
      <View className="ds-screen__content gap-4 items-center">
        <Text className="ds-type-h1 text-text-primary text-center">Your learning journey</Text>
        <Text className="ds-type-body-md text-text-secondary text-center">
          Welcome to your lessons.
        </Text>

        {currentLanguage ? (
          <View className="my-2 w-full max-w-[320px] flex-row items-center rounded-[16px] border border-[#EEF0F4] bg-[#F9FAFB] p-4">
            <View className="size-10 items-center justify-center overflow-hidden rounded-full border border-[#E5E7EB] bg-white">
              <Image
                source={{ uri: currentLanguage.flag }}
                className="size-full"
                resizeMode="cover"
              />
            </View>
            <View className="ml-3 flex-1">
              <Text className="font-poppins-semibold text-[16px] text-text-primary">
                {currentLanguage.name}
              </Text>
              <Text className="font-poppins text-[13px] text-text-secondary">
                Current Language
              </Text>
            </View>
          </View>
        ) : null}

        <Link href="/choose-language" asChild>
          <TouchableOpacity className="mt-2 h-[52px] w-full max-w-[320px] flex-row items-center justify-center rounded-[14px] bg-brand-purple active:opacity-90">
            <Text className="mr-2 text-[18px]">🌐</Text>
            <Text className="font-poppins-semibold text-[16px] text-white">
              Change Language
            </Text>
          </TouchableOpacity>
        </Link>

        {/* Test button to clear async storage */}
        <TouchableOpacity
          className="mt-1 h-[52px] w-full max-w-[320px] flex-row items-center justify-center rounded-[14px] border border-[#E5E7EB] bg-[#F9FAFB] active:bg-[#EEF0F4]"
          onPress={() => void clearSelectedLanguage()}
        >
          <Text className="mr-2 text-[16px]">🗑️</Text>
          <Text className="font-poppins-semibold text-[15px] text-text-primary">
            Clear Storage (Test State)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-1 h-[52px] w-full max-w-[320px] items-center justify-center rounded-[14px] bg-[#FF4D4F] active:opacity-80"
          onPress={() => void signOut()}
        >
          <Text className="font-poppins-semibold text-[16px] text-white">
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


