import { useRouter } from "expo-router";
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
import { LANGUAGES } from "@/data/languages";
import { useLanguageStore } from "@/store/useLanguageStore";
import { Language } from "@/types/learning";

export default function ChooseLanguage() {
  const router = useRouter();
  const storedSelectedLanguageId = useLanguageStore((state) => state.selectedLanguageId);
  const setStoreSelectedLanguageId = useLanguageStore((state) => state.setSelectedLanguageId);

  const [selectedLanguageId, setSelectedLanguageId] = useState<string>(
    storedSelectedLanguageId || "spanish"
  );
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredLanguages = LANGUAGES.filter((lang) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      lang.name.toLowerCase().includes(query) ||
      lang.nativeName.toLowerCase().includes(query)
    );
  });

  const selectedLanguage = LANGUAGES.find((l) => l.id === selectedLanguageId);

  const handleConfirm = () => {
    setStoreSelectedLanguageId(selectedLanguageId);
    router.replace("/home");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <StatusBar style="dark" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pb-3 pt-2">
        <TouchableOpacity
          accessibilityLabel="Go back"
          className="size-10 items-center justify-center rounded-full active:bg-[#F3F4F6]"
          onPress={() => router.back()}
        >
          <Text className="font-poppins text-[32px] leading-[32px] text-text-primary">
            {"\u2039"}
          </Text>
        </TouchableOpacity>

        <Text className="font-poppins-bold text-[20px] leading-[26px] text-text-primary">
          Choose a language
        </Text>

        <View className="size-10" />
      </View>

      {/* Search Input Bar */}
      <View className="mb-4 px-5">
        <View className="h-[52px] flex-row items-center rounded-full border border-[#EEF0F4] bg-[#F9FAFB] px-4">
          <Text className="mr-2.5 text-[16px] text-[#9CA3AF]">{"\uD83D\uDD0D"}</Text>
          <TextInput
            autoCapitalize="none"
            className="flex-1 font-poppins text-[15px] text-text-primary"
            onChangeText={setSearchQuery}
            placeholder="Search languages"
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Text className="font-poppins text-[16px] text-[#9CA3AF]">{"\u2715"}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Section Title */}
      <View className="mb-3 px-5">
        <Text className="font-poppins-bold text-[18px] leading-[24px] text-text-primary">
          Popular
        </Text>
      </View>

      {/* Language Selection List */}
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 8 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-3">
          {filteredLanguages.map((lang: Language) => {
            const isSelected = selectedLanguageId === lang.id;

            return (
              <TouchableOpacity
                key={lang.id}
                activeOpacity={0.7}
                className={`min-h-[72px] flex-row items-center justify-between rounded-[20px] px-4 py-3.5 ${
                  isSelected
                    ? "border-2 border-brand-purple bg-[#F7F5FF]"
                    : "border border-[#EEF0F4] bg-white"
                }`}
                onPress={() => setSelectedLanguageId(lang.id)}
              >
                <View className="flex-1 flex-row items-center">
                  <View className="size-11 items-center justify-center overflow-hidden rounded-full border border-[#E5E7EB] bg-[#F3F4F6]">
                    <Image
                      source={{ uri: lang.flag }}
                      className="size-full"
                      resizeMode="cover"
                    />
                  </View>

                  <View className="ml-3.5 flex-1">
                    <Text className="font-poppins-semibold text-[17px] leading-[22px] text-text-primary">
                      {lang.name}
                    </Text>
                    <Text className="mt-0.5 font-poppins text-[13px] leading-[18px] text-text-secondary">
                      {lang.learnersCount || `${lang.totalLessons} lessons`}
                    </Text>
                  </View>
                </View>

                {isSelected ? (
                  <View className="size-6 items-center justify-center rounded-full bg-brand-purple">
                    <Text className="font-poppins-bold text-[13px] text-white">
                      {"\u2713"}
                    </Text>
                  </View>
                ) : (
                  <Text className="font-poppins text-[22px] text-[#A0AEC0]">
                    {"\u203A"}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Confirmation Button replacing 'See all languages' */}
        <View className="mt-4 pb-2">
          <TouchableOpacity
            activeOpacity={0.8}
            className="h-[56px] w-full flex-row items-center justify-center rounded-[16px] bg-brand-purple active:bg-brand-deep-purple"
            onPress={handleConfirm}
          >
            <Text className="font-poppins-semibold text-[18px] text-white">
              Continue {selectedLanguage ? `with ${selectedLanguage.name}` : ""}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Earth Image Illustration at bottom */}
      <View className="h-[140px] w-full overflow-hidden items-center justify-flex-end">
        <Image
          source={images.earth}
          className="h-[180px] w-full"
          resizeMode="cover"
        />
      </View>
    </SafeAreaView>
  );
}
