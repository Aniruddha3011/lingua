import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  return (
    <View className="ds-screen justify-center">
      <View className="ds-screen__content gap-5">
        <Text className="ds-type-h1 text-text-primary">Welcome to Lingua</Text>
        <Text className="ds-type-body-md text-text-secondary">
          Start your language-learning journey.
        </Text>
        <Link href="/onboarding" asChild>
          <TouchableOpacity className="ds-button ds-button--primary w-full">
            <Text className="ds-type-body-lg font-poppins-semibold text-white">
              Get Started
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
