import { Language } from "@/types/learning";

export const LANGUAGES: Language[] = [
  {
    id: "spanish",
    code: "es",
    name: "Spanish",
    nativeName: "Espa\u00f1ol",
    flag: "https://flagcdn.com/w80/es.png",
    description: "Learn essential conversational Spanish for daily life and travel.",
    level: "Beginner",
    accentColor: "#FF4D4F",
    popular: true,
    learnersCount: "28.4M learners",
    totalUnits: 3,
    totalLessons: 9,
  },
  {
    id: "french",
    code: "fr",
    name: "French",
    nativeName: "Fran\u00e7ais",
    flag: "https://flagcdn.com/w80/fr.png",
    description: "Master everyday French expressions, dining out, and travel phrases.",
    level: "Beginner",
    accentColor: "#7C3AED",
    popular: true,
    learnersCount: "19.4M learners",
    totalUnits: 2,
    totalLessons: 6,
  },
  {
    id: "japanese",
    code: "ja",
    name: "Japanese",
    nativeName: "\u65e5\u672c\u8a9e",
    flag: "https://flagcdn.com/w80/jp.png",
    description: "Start speaking basic Japanese greetings, food names, and phrases.",
    level: "Beginner",
    accentColor: "#FF9D00",
    popular: true,
    learnersCount: "12.7M learners",
    totalUnits: 2,
    totalLessons: 4,
  },
  {
    id: "korean",
    code: "ko",
    name: "Korean",
    nativeName: "\ud55c\uad6d\uc5b4",
    flag: "https://flagcdn.com/w80/kr.png",
    description: "Learn essential Korean phrases, Hangul basics, and conversation.",
    level: "Beginner",
    accentColor: "#3B82F6",
    popular: true,
    learnersCount: "9.3M learners",
    totalUnits: 2,
    totalLessons: 4,
  },
  {
    id: "german",
    code: "de",
    name: "German",
    nativeName: "Deutsch",
    flag: "https://flagcdn.com/w80/de.png",
    description: "Build strong fundamental German vocabulary and practical grammar.",
    level: "Beginner",
    accentColor: "#208AEF",
    popular: true,
    learnersCount: "8.1M learners",
    totalUnits: 2,
    totalLessons: 4,
  },
  {
    id: "chinese",
    code: "zh",
    name: "Chinese",
    nativeName: "\u4e2d\u6587",
    flag: "https://flagcdn.com/w80/cn.png",
    description: "Master Mandarin greetings, numbers, and key everyday expressions.",
    level: "Beginner",
    accentColor: "#EF4444",
    popular: true,
    learnersCount: "7.4M learners",
    totalUnits: 2,
    totalLessons: 4,
  },
  {
    id: "italian",
    code: "it",
    name: "Italian",
    nativeName: "Italiano",
    flag: "https://flagcdn.com/w80/it.png",
    description: "Explore musical Italian phrases for dining, greetings, and culture.",
    level: "Beginner",
    accentColor: "#10B981",
    popular: false,
    learnersCount: "5.2M learners",
    totalUnits: 1,
    totalLessons: 3,
  },
];

export function getLanguages(): Language[] {
  return LANGUAGES;
}

export function getLanguageById(id: string): Language | undefined {
  return LANGUAGES.find((lang) => lang.id === id);
}

export function getPopularLanguages(): Language[] {
  return LANGUAGES.filter((lang) => lang.popular);
}
