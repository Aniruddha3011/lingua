import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";
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

        <TouchableOpacity
          className="mt-6 h-[52px] w-full max-w-[320px] items-center justify-center rounded-[14px] bg-[#FF4D4F] active:opacity-80"
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
