import { Link, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "@/constants/images";

import { VerificationModal } from "./verification-modal";

type AuthMode = "signIn" | "signUp";

type AuthScreenProps = {
  mode: AuthMode;
};

type SocialProvider = "Apple" | "Facebook" | "Google";

const socialProviders: SocialProvider[] = ["Google", "Facebook", "Apple"];

function SocialIcon({ provider }: { provider: SocialProvider }) {
  if (provider === "Facebook") {
    return (
      <View className="size-5 items-center justify-center rounded-full bg-[#1877F2]">
        <Text className="font-poppins-bold text-[16px] leading-[19px] text-white">f</Text>
      </View>
    );
  }

  if (provider === "Apple") {
    return <Text className="text-[22px] leading-[24px] text-text-primary">{"\uF8FF"}</Text>;
  }

  return <Text className="font-poppins-bold text-[20px] leading-[24px] text-[#4285F4]">G</Text>;
}

export function AuthScreen({ mode }: AuthScreenProps) {
  const router = useRouter();
  const [email, setEmail] = useState("alex@gmail.com");
  const [password, setPassword] = useState("language");
  const [isVerificationVisible, setIsVerificationVisible] = useState(false);
  const isSignUp = mode === "signUp";

  const title = isSignUp ? "Create your account" : "Welcome back";
  const subtitle = isSignUp
    ? "Start your language journey today \u2728"
    : "Continue your language journey";
  const actionLabel = isSignUp ? "Sign Up" : "Sign In";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full max-w-[420px] flex-1 self-center px-5 pb-6 pt-0">
          <TouchableOpacity
            accessibilityLabel="Go back"
            className="size-9 items-center justify-center"
            onPress={() => router.back()}
          >
            <Text className="font-poppins text-[36px] leading-[34px] text-text-primary">
              {"\u2039"}
            </Text>
          </TouchableOpacity>

          <View className="mt-2">
            <Text className="font-poppins-bold text-[24px] leading-[31px] tracking-[-0.35px] text-text-primary">
              {title}
            </Text>
            <Text className="mt-1 font-poppins text-[14px] leading-[20px] text-text-secondary">
              {subtitle}
            </Text>
          </View>

          <View className="relative h-[164px] items-center justify-center">
            <Text className="absolute left-[22%] top-7 text-[19px] text-[#FF9D00]">{"\u2726"}</Text>
            <Text className="absolute right-[20%] top-8 text-[17px] text-brand-blue">{"\u2726"}</Text>
            <Text className="absolute right-[14%] top-[62px] text-[20px] text-[#FFC800]">{"\u2726"}</Text>
            <Image
              source={images.mascotAuth}
              className="h-[200px] w-[280px]"
              resizeMode="contain"
            />
          </View>

          <View className="gap-2">
            <View className="h-[76px] rounded-[14px] border border-[#E8EAF0] px-4 py-2">
              <Text className="font-poppins text-[12px] leading-[17px] text-text-secondary">
                Email
              </Text>
              <TextInput
                autoCapitalize="none"
                autoComplete="email"
                className="mt-0.5 flex-1 font-poppins text-[16px] leading-[22px] text-text-primary"
                inputMode="email"
                keyboardType="email-address"
                onChangeText={setEmail}
                textContentType="emailAddress"
                value={email}
              />
            </View>

            {isSignUp ? (
              <View className="h-[76px] rounded-[14px] border border-[#E8EAF0] px-4 py-2">
                <Text className="font-poppins text-[12px] leading-[17px] text-text-secondary">
                  Password
                </Text>
                <View className="mt-1 flex-row items-center">
                  <TextInput
                    autoComplete="new-password"
                    className="flex-1 font-poppins text-[16px] leading-[22px] text-text-primary"
                    onChangeText={setPassword}
                    secureTextEntry
                    textContentType="newPassword"
                    value={password}
                  />
                  <View className="h-4 w-6 items-center justify-center rounded-full border-2 border-[#8490AD]">
                    <View className="size-1.5 rounded-full bg-[#8490AD]" />
                  </View>
                </View>
              </View>
            ) : null}

            <TouchableOpacity
              className="mt-1 h-[56px] items-center justify-center rounded-[14px] bg-brand-purple active:bg-brand-deep-purple"
              onPress={() => setIsVerificationVisible(true)}
            >
              <Text className="font-poppins-semibold text-[18px] leading-[24px] text-white">
                {actionLabel}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="my-5 flex-row items-center gap-3">
            <View className="h-px flex-1 bg-[#E5E7EB]" />
            <Text className="font-poppins text-[12px] text-text-secondary">or continue with</Text>
            <View className="h-px flex-1 bg-[#E5E7EB]" />
          </View>

          <View className="gap-2">
            {socialProviders.map((provider) => (
              <View
                key={provider}
                className="h-[56px] flex-row items-center rounded-[14px] border border-[#EEF0F4] px-5"
              >
                <View className="w-8 items-center">
                  <SocialIcon provider={provider} />
                </View>
                <Text className="ml-5 font-poppins-medium text-[14px] leading-[20px] text-text-primary">
                  Continue with {provider}
                </Text>
              </View>
            ))}
          </View>

          <View className="mt-auto pt-8 flex-row justify-center">
            <Text className="font-poppins text-[13px] leading-[20px] text-text-secondary">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            </Text>
            <Link
              href={isSignUp ? "/sign-in" : "/sign-up"}
              className="font-poppins-medium text-[13px] leading-[20px] text-brand-purple"
            >
              {isSignUp ? "Log in" : "Sign up"}
            </Link>
          </View>
        </View>
      </ScrollView>

      <VerificationModal
        visible={isVerificationVisible}
        onDismiss={() => setIsVerificationVisible(false)}
        onVerified={() => router.replace("/home")}
        verifyCode={async (enteredCode) =>
          /^\d{6}$/.test(enteredCode) && enteredCode !== "000000"
        }
      />
    </SafeAreaView>
  );
}
