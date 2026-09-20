import { useAuth } from "@clerk/expo";
import { Link, Redirect } from "expo-router";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

export default function Home() {
  const { isSignedIn, isLoaded, signOut } = useAuth();

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFFFFF" }}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <View className="ds-screen justify-center px-6">
      <View className="ds-screen__content gap-4 items-center">
        <Text className="ds-type-h1 text-text-primary text-center">Your learning journey</Text>
        <Text className="ds-type-body-md text-text-secondary text-center">
          Welcome to your lessons.
        </Text>

        <Link href="/choose-language" asChild>
          <TouchableOpacity className="mt-4 h-[52px] w-full max-w-[320px] flex-row items-center justify-center rounded-[14px] bg-brand-purple active:opacity-90">
            <Text className="mr-2 text-[18px]">🌐</Text>
            <Text className="font-poppins-semibold text-[16px] text-white">
              Choose Language
            </Text>
          </TouchableOpacity>
        </Link>

        <TouchableOpacity
          className="mt-2 h-[52px] w-full max-w-[320px] items-center justify-center rounded-[14px] bg-[#FF4D4F] active:opacity-80"
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

