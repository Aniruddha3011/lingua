import { Text, View } from "react-native";

export default function Home() {
  return (
    <View className="ds-screen justify-center">
      <View className="ds-screen__content gap-2">
        <Text className="ds-type-h1 text-text-primary">Your learning journey</Text>
        <Text className="ds-type-body-md text-text-secondary">
          Welcome to your lessons.
        </Text>
      </View>
    </View>
  );
}