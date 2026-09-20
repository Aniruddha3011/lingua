import { Unit } from "@/types/learning";

export const UNITS: Unit[] = [
  // Spanish Units
  {
    id: "es-unit-1",
    languageId: "spanish",
    unitNumber: 1,
    title: "Greetings & Basics",
    description: "Learn essential greetings, introductions, and polite expressions.",
    icon: "\ud83d\udc4b",
    color: "#7C3AED",
    totalLessons: 3,
  },
  {
    id: "es-unit-2",
    languageId: "spanish",
    unitNumber: 2,
    title: "Food & Dining Out",
    description: "Order drinks, request meals, and talk about your favorite foods.",
    icon: "\ud83c\udf55",
    color: "#FF4D4F",
    totalLessons: 3,
  },
  {
    id: "es-unit-3",
    languageId: "spanish",
    unitNumber: 3,
    title: "Travel & Directions",
    description: "Navigate cities, ask for directions, and buy transport tickets.",
    icon: "\u2708\ufe0f",
    color: "#208AEF",
    totalLessons: 3,
  },

  // French Units
  {
    id: "fr-unit-1",
    languageId: "french",
    unitNumber: 1,
    title: "Essential Greetings",
    description: "Greet people politely and introduce yourself in French.",
    icon: "\ud83d\udc4b",
    color: "#7C3AED",
    totalLessons: 3,
  },
  {
    id: "fr-unit-2",
    languageId: "french",
    unitNumber: 2,
    title: "Caf\u00e9 Culture & Food",
    description: "Order coffee, pastries, and lunch at a French bistro.",
    icon: "\u2615",
    color: "#FF9D00",
    totalLessons: 3,
  },

  // German Units
  {
    id: "de-unit-1",
    languageId: "german",
    unitNumber: 1,
    title: "First Steps & Greetings",
    description: "Say hello, goodbye, and introduce yourself in German.",
    icon: "\ud83d\udc4b",
    color: "#208AEF",
    totalLessons: 2,
  },
  {
    id: "de-unit-2",
    languageId: "german",
    unitNumber: 2,
    title: "At the Restaurant",
    description: "Order food, drinks, and pay the bill in German-speaking countries.",
    icon: "\ud83c\udf7a",
    color: "#10B981",
    totalLessons: 2,
  },

  // Japanese Units
  {
    id: "ja-unit-1",
    languageId: "japanese",
    unitNumber: 1,
    title: "Greetings & Self Introduction",
    description: "Master basic Japanese greetings and simple introductions.",
    icon: "\ud83d\ude47",
    color: "#FF9D00",
    totalLessons: 2,
  },
  {
    id: "ja-unit-2",
    languageId: "japanese",
    unitNumber: 2,
    title: "Ordering Ramen & Drinks",
    description: "Order food and drinks at Japanese restaurants.",
    icon: "\ud83c\udf5c",
    color: "#FF4D4F",
    totalLessons: 2,
  },

  // Italian Units
  {
    id: "it-unit-1",
    languageId: "italian",
    unitNumber: 1,
    title: "Buon Giorno! Basics",
    description: "Learn polite Italian greetings, coffee ordering, and basics.",
    icon: "\u2615",
    color: "#10B981",
    totalLessons: 3,
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
