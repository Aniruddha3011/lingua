import { getLessonsByUnit } from "@/data/lessons";
import { Unit } from "@/types/learning";

const totalLessonsFor = (unitId: string) => getLessonsByUnit(unitId).length;

export const UNITS: Unit[] = [
  // Spanish Units
  {
    id: "es-unit-1",
    languageId: "spanish",
    unitNumber: 1,
    title: "Greetings & Basics",
    description: "Learn essential greetings, introductions, and polite expressions.",
    icon: "👋",
    color: "#7C3AED",
    totalLessons: totalLessonsFor("es-unit-1"),
  },
  {
    id: "es-unit-2",
    languageId: "spanish",
    unitNumber: 2,
    title: "Food & Dining Out",
    description: "Order drinks, request meals, and talk about your favorite foods.",
    icon: "🍕",
    color: "#FF4D4F",
    totalLessons: totalLessonsFor("es-unit-2"),
  },
  {
    id: "es-unit-3",
    languageId: "spanish",
    unitNumber: 3,
    title: "At the Café",
    description: "Navigate café culture, order drinks, ask for directions, and talk about your day.",
    icon: "☕",
    color: "#208AEF",
    totalLessons: totalLessonsFor("es-unit-3"),
  },

  // French Units
  {
    id: "fr-unit-1",
    languageId: "french",
    unitNumber: 1,
    title: "Essential Greetings",
    description: "Greet people politely and introduce yourself in French.",
    icon: "👋",
    color: "#7C3AED",
    totalLessons: totalLessonsFor("fr-unit-1"),
  },
  {
    id: "fr-unit-2",
    languageId: "french",
    unitNumber: 2,
    title: "Café Culture & Food",
    description: "Order coffee, pastries, and lunch at a French bistro.",
    icon: "☕",
    color: "#FF9D00",
    totalLessons: totalLessonsFor("fr-unit-2"),
  },

  // German Units
  {
    id: "de-unit-1",
    languageId: "german",
    unitNumber: 1,
    title: "First Steps & Greetings",
    description: "Say hello, goodbye, and introduce yourself in German.",
    icon: "👋",
    color: "#208AEF",
    totalLessons: totalLessonsFor("de-unit-1"),
  },
  {
    id: "de-unit-2",
    languageId: "german",
    unitNumber: 2,
    title: "At the Restaurant",
    description: "Order food, drinks, and pay the bill in German-speaking countries.",
    icon: "🍺",
    color: "#10B981",
    totalLessons: totalLessonsFor("de-unit-2"),
  },

  // Japanese Units
  {
    id: "ja-unit-1",
    languageId: "japanese",
    unitNumber: 1,
    title: "Greetings & Self Introduction",
    description: "Master basic Japanese greetings and simple introductions.",
    icon: "🙇",
    color: "#FF9D00",
    totalLessons: totalLessonsFor("ja-unit-1"),
  },
  {
    id: "ja-unit-2",
    languageId: "japanese",
    unitNumber: 2,
    title: "Ordering Ramen & Drinks",
    description: "Order food and drinks at Japanese restaurants.",
    icon: "🍜",
    color: "#FF4D4F",
    totalLessons: totalLessonsFor("ja-unit-2"),
  },

  // Korean Units
  {
    id: "ko-unit-1",
    languageId: "korean",
    unitNumber: 1,
    title: "Hangul & Greetings",
    description: "Master basic Korean greetings and friendly introductions.",
    icon: "🇰🇷",
    color: "#3B82F6",
    totalLessons: totalLessonsFor("ko-unit-1"),
  },
  {
    id: "ko-unit-2",
    languageId: "korean",
    unitNumber: 2,
    title: "K-Food & Dining",
    description: "Order delicious Korean food, drinks, and snacks.",
    icon: "🍱",
    color: "#EF4444",
    totalLessons: totalLessonsFor("ko-unit-2"),
  },

  // Chinese Units
  {
    id: "zh-unit-1",
    languageId: "chinese",
    unitNumber: 1,
    title: "Pinyin & Greetings",
    description: "Learn essential Mandarin greetings and simple polite phrases.",
    icon: "🇨🇳",
    color: "#EF4444",
    totalLessons: totalLessonsFor("zh-unit-1"),
  },
  {
    id: "zh-unit-2",
    languageId: "chinese",
    unitNumber: 2,
    title: "Tea & Dining Out",
    description: "Order tea, dumplings, and meals in Chinese.",
    icon: "🍵",
    color: "#10B981",
    totalLessons: totalLessonsFor("zh-unit-2"),
  },

  // Italian Units
  {
    id: "it-unit-1",
    languageId: "italian",
    unitNumber: 1,
    title: "Buon Giorno! Basics",
    description: "Learn polite Italian greetings, coffee ordering, and basics.",
    icon: "☕",
    color: "#10B981",
    totalLessons: totalLessonsFor("it-unit-1"),
  },
  {
    id: "it-unit-2",
    languageId: "italian",
    unitNumber: 2,
    title: "Pasta & Gelato",
    description: "Order delicious pizza, pasta, and gelato in Italy.",
    icon: "🍝",
    color: "#F59E0B",
    totalLessons: totalLessonsFor("it-unit-2"),
  },
];

export function getUnits(): Unit[] {
  return UNITS;
}

export function getUnitsByLanguage(languageId: string): Unit[] {
  return UNITS.filter((unit) => unit.languageId === languageId);
}

export function getUnitById(id: string): Unit | undefined {
  return UNITS.find((unit) => unit.id === id);
}
