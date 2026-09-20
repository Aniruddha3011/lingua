import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "@/constants/images";

export default function Onboarding() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <StatusBar style="dark" />

      <View className="flex-1 overflow-hidden">
        <View className="flex-row items-center justify-center gap-1 pt-2">
          <Image
            source={images.mascotLogo}
            className="size-[72px]"
            resizeMode="contain"
          />
          <Text className="font-poppins-semibold text-[27px] leading-[32px] text-text-primary">
            Lingua
          </Text>
        </View>

        <View className="mt-10 px-7">
          <Text className="font-poppins-bold text-[34px] leading-[43px] tracking-[-0.6px] text-text-primary">
            Your AI language{"\n"}
            <Text className="text-brand-purple">teacher.</Text>
          </Text>
          <Text className="mt-5 max-w-[340px] font-poppins text-[17px] leading-[27px] text-text-secondary">
            Real conversations, personalized{"\n"}lessons, anytime, anywhere.
          </Text>
        </View>

        <View className="relative flex-1">
          <View className="absolute left-10 top-8 z-10 rotate-[-8deg]">
            <View className="absolute -bottom-1 left-9 size-4 rotate-[28deg] bg-[#E9F4FF]" />
            <View className="rounded-[20px] bg-[#E9F4FF] px-5 py-3">
              <Text className="font-poppins-medium text-[21px] leading-[28px] text-text-primary">
                Hello!
              </Text>
            </View>
          </View>

          <View className="absolute right-10 top-1 z-10 rotate-[10deg]">
            <View className="absolute -bottom-1 right-9 size-4 rotate-[32deg] bg-[#F4F1FF]" />
            <View className="rounded-[20px] bg-[#F4F1FF] px-5 py-3">
              <Text className="font-poppins-medium text-[21px] leading-[28px] text-brand-purple">
                {"\u00A1Hola!"}
              </Text>
            </View>
          </View>

          <View className="absolute right-8 top-[80px] z-10 rotate-[10deg]">
            <View className="absolute -bottom-1 left-7 size-4 rotate-[28deg] bg-[#FFF0EB]" />
            <View className="rounded-[20px] bg-[#FFF0EB] px-5 py-3">
              <Text className="font-poppins-medium text-[21px] leading-[28px] text-[#FF4D4F]">
                {"\u4f60\u597d\uff01"}
              </Text>
            </View>
          </View>

          <View className="absolute inset-x-0 bottom-[-32px] items-center">
            <Image
              source={images.mascotWelcome}
              className="size-[420px]"
              resizeMode="contain"
            />
          </View>
        </View>

        <View className="mb-7 flex-row items-center justify-center gap-2">
          <View className="size-2 rounded-full bg-brand-purple" />
          <View className="size-2 rounded-full bg-[#E6E8EF]" />
          <View className="size-2 rounded-full bg-[#E6E8EF]" />
          <View className="size-2 rounded-full bg-[#E6E8EF]" />
        </View>

        <TouchableOpacity
          className="mx-7 mb-5 h-[76px] flex-row items-center justify-center rounded-[20px] bg-brand-purple active:bg-brand-deep-purple"
          onPress={() => router.replace("/sign-up")}
        >
          <Text className="font-poppins-semibold text-[22px] leading-[28px] text-white">
            Get Started
          </Text>
          <Text className="absolute right-9 font-poppins text-[43px] leading-[43px] text-white">
            {"\u203A"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
