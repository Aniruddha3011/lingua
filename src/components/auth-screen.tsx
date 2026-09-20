import { useSignIn, useSignUp, useSSO } from "@clerk/expo";
import * as AuthSession from "expo-auth-session";
import { Link, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
    ActivityIndicator,
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
  const { signUp } = useSignUp();
  const { signIn } = useSignIn();
  const { startSSOFlow } = useSSO();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVerificationVisible, setIsVerificationVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSignUp = mode === "signUp";

  const title = isSignUp ? "Create your account" : "Welcome back";
  const subtitle = isSignUp
    ? "Start your language journey today \u2728"
    : "Continue your language journey";
  const actionLabel = isSignUp ? "Sign Up" : "Sign In";

  const handleSignUp = async () => {
    setErrorMessage(null);
    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await signUp.password({ emailAddress: email, password });
      if (error) {
        setErrorMessage(error.message || "Failed to create account. Please try again.");
        setIsSubmitting(false);
        return;
      }

      const { error: sendError } = await signUp.verifications.sendEmailCode();
      if (sendError) {
        setErrorMessage(sendError.message || "Failed to send verification code.");
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      setVerificationError(null);
      setIsVerificationVisible(true);
    } catch (err: any) {
      setErrorMessage(err?.message || "An error occurred during sign up.");
      setIsSubmitting(false);
    }
  };

  const handleSignIn = async () => {
    setErrorMessage(null);
    if (!email) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await signIn.emailCode.sendCode({ emailAddress: email });
      if (error) {
        if (password) {
          const { error: pwdError } = await signIn.password({ emailAddress: email, password });
          if (!pwdError && signIn.status === "complete") {
            await signIn.finalize();
            setIsSubmitting(false);
            router.replace("/");
            return;
          }
        }
        setErrorMessage(error.message || "Sign in failed. Please check your credentials.");
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      setVerificationError(null);
      setIsVerificationVisible(true);
    } catch (err: any) {
      setErrorMessage(err?.message || "An error occurred during sign in.");
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = async (code: string): Promise<boolean> => {
    setVerificationError(null);
    if (isSignUp) {
      try {
        const { error } = await signUp.verifications.verifyEmailCode({ code });
        if (error) {
          setVerificationError(error.message || "Invalid verification code.");
          return false;
        }

        const { error: finalizeError } = await signUp.finalize();
        if (finalizeError) {
          setVerificationError(finalizeError.message || "Failed to finalize session.");
          return false;
        }

        return true;
      } catch (err: any) {
        setVerificationError(err?.message || "Verification failed.");
        return false;
      }
    } else {
      try {
        const { error } = await signIn.emailCode.verifyCode({ code });
        if (error) {
          setVerificationError(error.message || "Invalid verification code.");
          return false;
        }

        if (signIn.status === "complete") {
          const { error: finalizeError } = await signIn.finalize();
          if (finalizeError) {
            setVerificationError(finalizeError.message || "Failed to finalize session.");
            return false;
          }
          return true;
        }

        setVerificationError("Additional authentication steps required.");
        return false;
      } catch (err: any) {
        setVerificationError(err?.message || "Verification failed.");
        return false;
      }
    }
  };

  const handleSocialAuth = async (provider: SocialProvider) => {
    setErrorMessage(null);
    let strategy: "oauth_google" | "oauth_facebook" | "oauth_apple";
    if (provider === "Google") strategy = "oauth_google";
    else if (provider === "Facebook") strategy = "oauth_facebook";
    else strategy = "oauth_apple";

    try {
      const redirectUrl = AuthSession.makeRedirectUri({ path: "sso-callback" });
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy,
        redirectUrl,
      });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace("/home");
      }
    } catch (err: any) {
      setErrorMessage(err?.message || `Failed to sign in with ${provider}.`);
    }
  };

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

          {errorMessage ? (
            <View className="mb-3 rounded-[10px] bg-[#FFF2F0] px-4 py-2 border border-[#FFCCC7]">
              <Text className="font-poppins text-[13px] text-[#FF4D4F]">
                {errorMessage}
              </Text>
            </View>
          ) : null}

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
              disabled={isSubmitting}
              onPress={isSignUp ? handleSignUp : handleSignIn}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="font-poppins-semibold text-[18px] leading-[24px] text-white">
                  {actionLabel}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <View className="my-5 flex-row items-center gap-3">
            <View className="h-px flex-1 bg-[#E5E7EB]" />
            <Text className="font-poppins text-[12px] text-text-secondary">or continue with</Text>
            <View className="h-px flex-1 bg-[#E5E7EB]" />
          </View>

          <View className="gap-2">
            {socialProviders.map((provider) => (
              <TouchableOpacity
                key={provider}
                className="h-[56px] flex-row items-center rounded-[14px] border border-[#EEF0F4] px-5 active:bg-[#F9FAFB]"
                onPress={() => handleSocialAuth(provider)}
              >
                <View className="w-8 items-center">
                  <SocialIcon provider={provider} />
                </View>
                <Text className="ml-5 font-poppins-medium text-[14px] leading-[20px] text-text-primary">
                  Continue with {provider}
                </Text>
              </TouchableOpacity>
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

          {/* Required mount point for Clerk captcha bot protection */}
          <View nativeID="clerk-captcha" />
        </View>
      </ScrollView>

      <VerificationModal
        errorMessage={verificationError}
        visible={isVerificationVisible}
        onDismiss={() => {
          setIsVerificationVisible(false);
          setVerificationError(null);
        }}
        onVerified={() => router.replace("/")}
        verifyCode={handleVerifyCode}
      />
    </SafeAreaView>
  );
}

