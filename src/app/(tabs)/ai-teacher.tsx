import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AITeacherTab() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View className="flex-1 items-center justify-center px-6">
        <Text className="font-poppins-bold text-[28px] leading-[36px] text-text-primary text-center">
          AI Teacher Tab
        </Text>
        <Text className="mt-2 font-poppins text-[15px] leading-[22px] text-text-secondary text-center">
          Practice real-time voice and video lessons with your personalized AI teacher.
        </Text>
      </View>
    </SafeAreaView>
  );
}
