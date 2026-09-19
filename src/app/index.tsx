import { useState } from "react";
import { Text, TextInput, View } from "react-native";

import { colors } from "@/theme";

export default function Index() {
  const [name, setName] = useState("");

  return (
    <View className="ds-screen justify-center">
      <View className="ds-screen__content gap-5">
        <Text className="ds-type-h1 text-text-primary">Welcome to Lingua</Text>
        <Text className="ds-type-body-md text-text-secondary">
          Start your language-learning journey.
        </Text>
        <TextInput
          className="ds-input font-poppins text-body-md mb-2 w-full rounded-lg border border-neutral-border bg-neutral-surface px-2 py-3 text-text-primary placeholder:text-text-secondary"
          placeholder="Enter your name"
          placeholderTextColor={colors.neutral.textSecondary}
          value={name}
          onChangeText={setName}
        />
        {name ? (
          <Text className="ds-type-body-lg text-text-primary text-top color-lingua-red">Hello, {name}!</Text>
        ) : null}
      </View>
    </View>
  );
}
