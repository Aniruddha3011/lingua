import { Lesson } from "@/types/learning";

type LessonExtension = Pick<Lesson, "id" | "unitId" | "languageId" | "title" | "description" | "order"> & {
  word: string;
  translation: string;
  imageUrl?: string;
};

function createPracticeLesson(entry: LessonExtension): Lesson {
  return {
    ...entry,
    type: "standard",
    xp: 15,
    durationMinutes: 3,
    imageUrl: entry.imageUrl ?? `https://picsum.photos/seed/${entry.id}/400/300`,
    goals: [
      { id: `${entry.id}-goal-1`, description: `Recognize “${entry.word}”`, xpReward: 5 },
      { id: `${entry.id}-goal-2`, description: "Complete practice exercises", xpReward: 10 },
    ],
    vocabulary: [
      {
        id: `${entry.id}-word`,
        word: entry.word,
        translation: entry.translation,
      },
    ],
    phrases: [],
    activities: [
      {
        id: `${entry.id}-activity`,
        type: "multiple-choice",
        prompt: `What does “${entry.word}” mean?`,
        options: [entry.translation, "Goodbye", "Please"],
        correctAnswer: entry.translation,
      },
    ],
  };
}

const CURRICULUM_EXTENSIONS: Lesson[] = [
  // --- SPANISH EXTENSIONS (Completing 6 lessons path) ---
  createPracticeLesson({
    id: "es-1-4", unitId: "es-unit-3", languageId: "spanish", order: 4,
    title: "Travel & Directions", description: "Navigate cities, ask for directions, and buy transport tickets.",
    word: "¿Dónde está...?", translation: "Where is...?",
    imageUrl: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&auto=format&fit=crop&q=80",
  }),
  createPracticeLesson({
    id: "es-1-5", unitId: "es-unit-3", languageId: "spanish", order: 5,
    title: "Shopping", description: "Learn numbers, prices, and how to buy items at a market.",
    word: "¿Cuánto cuesta?", translation: "How much does it cost?",
    imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&auto=format&fit=crop&q=80",
  }),
  createPracticeLesson({
    id: "es-1-6", unitId: "es-unit-3", languageId: "spanish", order: 6,
    title: "Family & Friends", description: "Talk about your family, friends, and daily routines.",
    word: "Mi familia", translation: "My family",
    imageUrl: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&auto=format&fit=crop&q=80",
  }),

  // --- FRENCH EXTENSIONS ---
  createPracticeLesson({
    id: "fr-1-3", unitId: "fr-unit-1", languageId: "french", order: 3,
    title: "Introducing Yourself", description: "Share your name and ask someone theirs.", word: "Je m'appelle", translation: "My name is",
    imageUrl: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&auto=format&fit=crop&q=80",
  }),
  createPracticeLesson({
    id: "fr-2-1", unitId: "fr-unit-2", languageId: "french", order: 4,
    title: "Ordering Coffee", description: "Order a coffee at a friendly French café.", word: "Un café", translation: "A coffee",
    imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&auto=format&fit=crop&q=80",
  }),
  createPracticeLesson({
    id: "fr-2-2", unitId: "fr-unit-2", languageId: "french", order: 5,
    title: "At the Bakery", description: "Choose a pastry and thank the baker.", word: "Une baguette", translation: "A baguette",
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop&q=80",
  }),
  createPracticeLesson({
    id: "fr-2-3", unitId: "fr-unit-2", languageId: "french", order: 6,
    title: "Paying the Bill", description: "Ask for the bill and pay politely.", word: "L'addition", translation: "The bill",
    imageUrl: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=400&auto=format&fit=crop&q=80",
  }),

  // --- GERMAN EXTENSIONS ---
  createPracticeLesson({
    id: "de-1-2", unitId: "de-unit-1", languageId: "german", order: 2,
    title: "Meeting Someone", description: "Introduce yourself and make a new friend.", word: "Ich heiße", translation: "My name is",
  }),
  createPracticeLesson({
    id: "de-1-3", unitId: "de-unit-1", languageId: "german", order: 3,
    title: "Please & Thank You", description: "Use polite words in everyday German.", word: "Bitte", translation: "Please",
  }),
  createPracticeLesson({
    id: "de-2-1", unitId: "de-unit-2", languageId: "german", order: 4,
    title: "Ordering a Drink", description: "Order a refreshing drink at a restaurant.", word: "Ein Wasser", translation: "A water",
  }),
  createPracticeLesson({
    id: "de-2-2", unitId: "de-unit-2", languageId: "german", order: 5,
    title: "Your Favorite Food", description: "Talk about food you enjoy.", word: "Ich mag", translation: "I like",
  }),
  createPracticeLesson({
    id: "de-2-3", unitId: "de-unit-2", languageId: "german", order: 6,
    title: "Paying at the Table", description: "Ask for the bill after your meal.", word: "Die Rechnung", translation: "The bill",
  }),

  // --- JAPANESE EXTENSIONS ---
  createPracticeLesson({
    id: "ja-1-2", unitId: "ja-unit-1", languageId: "japanese", order: 2,
    title: "Nice to Meet You", description: "Make a warm first introduction in Japanese.", word: "はじめまして", translation: "Nice to meet you",
  }),
  createPracticeLesson({
    id: "ja-1-3", unitId: "ja-unit-1", languageId: "japanese", order: 3,
    title: "My Name Is...", description: "Say your name clearly and politely.", word: "わたしは", translation: "I am",
  }),
  createPracticeLesson({
    id: "ja-2-1", unitId: "ja-unit-2", languageId: "japanese", order: 4,
    title: "A Bowl of Ramen", description: "Order a delicious bowl of ramen.", word: "ラーメン", translation: "Ramen",
  }),
  createPracticeLesson({
    id: "ja-2-2", unitId: "ja-unit-2", languageId: "japanese", order: 5,
    title: "Something to Drink", description: "Ask for tea or water at a restaurant.", word: "お水", translation: "Water",
  }),
  createPracticeLesson({
    id: "ja-2-3", unitId: "ja-unit-2", languageId: "japanese", order: 6,
    title: "The Check, Please", description: "Finish your meal with a polite request.", word: "お会計", translation: "The check",
  }),

  // --- KOREAN EXTENSIONS ---
  createPracticeLesson({
    id: "ko-1-1", unitId: "ko-unit-1", languageId: "korean", order: 1,
    title: "Hello & Thank You", description: "Learn basic Korean greetings like Annyeonghaseyo.", word: "안녕하세요", translation: "Hello",
  }),
  createPracticeLesson({
    id: "ko-1-2", unitId: "ko-unit-1", languageId: "korean", order: 2,
    title: "Nice to Meet You", description: "Introduce yourself politely in Korean.", word: "반갑습니다", translation: "Nice to meet you",
  }),
  createPracticeLesson({
    id: "ko-1-3", unitId: "ko-unit-1", languageId: "korean", order: 3,
    title: "Yes & No", description: "Master basic agreement and polite responses.", word: "네 / 아니요", translation: "Yes / No",
  }),
  createPracticeLesson({
    id: "ko-2-1", unitId: "ko-unit-2", languageId: "korean", order: 4,
    title: "Ordering Delicious Food", description: "Order K-food at a restaurant.", word: "주세요", translation: "Please give me",
  }),
  createPracticeLesson({
    id: "ko-2-2", unitId: "ko-unit-2", languageId: "korean", order: 5,
    title: "Coffee & Drinks", description: "Order iced americano and tea.", word: "커피", translation: "Coffee",
  }),
  createPracticeLesson({
    id: "ko-2-3", unitId: "ko-unit-2", languageId: "korean", order: 6,
    title: "Asking the Price", description: "Ask how much an item costs.", word: "얼마예요?", translation: "How much is it?",
  }),

  // --- CHINESE EXTENSIONS ---
  createPracticeLesson({
    id: "zh-1-1", unitId: "zh-unit-1", languageId: "chinese", order: 1,
    title: "Ni Hao & Goodbye", description: "Learn basic Mandarin greetings.", word: "你好", translation: "Hello",
  }),
  createPracticeLesson({
    id: "zh-1-2", unitId: "zh-unit-1", languageId: "chinese", order: 2,
    title: "Thank You Very Much", description: "Say thank you and you're welcome.", word: "谢谢", translation: "Thank you",
  }),
  createPracticeLesson({
    id: "zh-1-3", unitId: "zh-unit-1", languageId: "chinese", order: 3,
    title: "What is Your Name?", description: "Ask and answer names in Chinese.", word: "你叫什么名字？", translation: "What is your name?",
  }),
  createPracticeLesson({
    id: "zh-2-1", unitId: "zh-unit-2", languageId: "chinese", order: 4,
    title: "Ordering Green Tea", description: "Enjoy tea culture and order drinks.", word: "茶", translation: "Tea",
  }),
  createPracticeLesson({
    id: "zh-2-2", unitId: "zh-unit-2", languageId: "chinese", order: 5,
    title: "Eating Dumplings", description: "Order delicious food at a restaurant.", word: "饺子", translation: "Dumplings",
  }),
  createPracticeLesson({
    id: "zh-2-3", unitId: "zh-unit-2", languageId: "chinese", order: 6,
    title: "Asking for the Bill", description: "Pay for your meal politely.", word: "买单", translation: "Pay the bill",
  }),

  // --- ITALIAN EXTENSIONS ---
  createPracticeLesson({
    id: "it-1-2", unitId: "it-unit-1", languageId: "italian", order: 2,
    title: "Introducing Yourself", description: "Say your name and meet someone new.", word: "Mi chiamo", translation: "My name is",
  }),
  createPracticeLesson({
    id: "it-1-3", unitId: "it-unit-1", languageId: "italian", order: 3,
    title: "Please & Thank You", description: "Use kind words in everyday conversation.", word: "Per favore", translation: "Please",
  }),
  createPracticeLesson({
    id: "it-2-1", unitId: "it-unit-2", languageId: "italian", order: 4,
    title: "At the Gelateria", description: "Choose your favorite flavor of gelato.", word: "Un gelato", translation: "An ice cream",
  }),
  createPracticeLesson({
    id: "it-2-2", unitId: "it-unit-2", languageId: "italian", order: 5,
    title: "Finding a Table", description: "Ask for a table at a restaurant.", word: "Un tavolo", translation: "A table",
  }),
  createPracticeLesson({
    id: "it-2-3", unitId: "it-unit-2", languageId: "italian", order: 6,
    title: "See You Soon", description: "End a conversation with a friendly goodbye.", word: "A presto", translation: "See you soon",
  }),
];

export const LESSONS: Lesson[] = [
  // --- SPANISH LESSONS (Matches 06-lesson-screen.png sequence) ---
  {
    id: "es-1-1",
    unitId: "es-unit-3",
    languageId: "spanish",
    title: "Greetings & Introductions",
    description: "Learn essential Spanish greetings like Hola, Buenos días, and Adiós.",
    type: "standard",
    xp: 15,
    durationMinutes: 3,
    order: 1,
    imageUrl: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&auto=format&fit=crop&q=80",
    goals: [
      { id: "g1", description: "Recognize 4 basic Spanish greetings", xpReward: 5 },
      { id: "g2", description: "Complete all matching & translation exercises", xpReward: 10 },
    ],
    vocabulary: [
      { id: "v1", word: "Hola", translation: "Hello / Hi", phonetic: "oh-lah" },
      { id: "v2", word: "Buenos días", translation: "Good morning", phonetic: "bweh-nohs dee-ahs" },
    ],
    phrases: [
      { id: "p1", text: "¡Hola! ¿Cómo te llamas?", translation: "Hello! What is your name?", speaker: "teacher" },
    ],
    activities: [
      {
        id: "a1",
        type: "multiple-choice",
        prompt: "How do you say 'Hello' in Spanish?",
        options: ["Hola", "Adiós", "Gracias"],
        correctAnswer: "Hola",
      },
    ],
  },
  {
    id: "es-1-2",
    unitId: "es-unit-3",
    languageId: "spanish",
    title: "Daily Life",
    description: "Learn how to state your name, ask how someone is, and talk about daily routines.",
    type: "audio",
    xp: 20,
    durationMinutes: 4,
    order: 2,
    imageUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&auto=format&fit=crop&q=80",
    goals: [
      { id: "g3", description: "Practice self-introductions in audio format", xpReward: 10 },
    ],
    vocabulary: [
      { id: "v5", word: "Me llamo", translation: "My name is", phonetic: "meh yah-moh" },
    ],
    phrases: [],
    activities: [],
  },
  {
    id: "es-1-3",
    unitId: "es-unit-3",
    languageId: "spanish",
    title: "At the Café",
    description: "Order coffee, pastries, and talk about your day at a cozy Spanish café.",
    type: "video-teacher",
    xp: 30,
    durationMinutes: 5,
    order: 3,
    imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&auto=format&fit=crop&q=80",
    aiTeacherPrompt:
      "You are Sofia, a friendly AI Spanish teacher at a cozy café in Madrid.",
    goals: [
      { id: "g5", description: "Converse in Spanish with your AI Teacher at the café", xpReward: 15 },
    ],
    vocabulary: [
      { id: "v8", word: "Un café", translation: "A coffee", phonetic: "oon kah-feh" },
    ],
    phrases: [],
    activities: [],
  },

  // --- FRENCH LESSONS ---
  {
    id: "fr-1-1",
    unitId: "fr-unit-1",
    languageId: "french",
    title: "Bonjour & Merci",
    description: "Learn basic French greetings and polite words.",
    type: "standard",
    xp: 15,
    durationMinutes: 3,
    order: 1,
    imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&auto=format&fit=crop&q=80",
    goals: [], vocabulary: [], phrases: [], activities: [],
  },
  {
    id: "fr-1-2",
    unitId: "fr-unit-1",
    languageId: "french",
    title: "Daily Life in Paris",
    description: "Express simple daily needs and polite phrases.",
    type: "audio",
    xp: 20,
    durationMinutes: 4,
    order: 2,
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop&q=80",
    goals: [], vocabulary: [], phrases: [], activities: [],
  },

  // --- GERMAN LESSONS ---
  {
    id: "de-1-1",
    unitId: "de-unit-1",
    languageId: "german",
    title: "Hallo & Guten Tag",
    description: "Learn German greetings like Hallo, Guten Tag, and Tschüss.",
    type: "standard",
    xp: 15,
    durationMinutes: 3,
    order: 1,
    goals: [], vocabulary: [], phrases: [], activities: [],
  },

  // --- JAPANESE LESSONS ---
  {
    id: "ja-1-1",
    unitId: "ja-unit-1",
    languageId: "japanese",
    title: "Konnichiwa & Arigatou",
    description: "Learn essential Japanese greetings and expressions.",
    type: "standard",
    xp: 15,
    durationMinutes: 3,
    order: 1,
    goals: [], vocabulary: [], phrases: [], activities: [],
  },

  // --- ITALIAN LESSONS ---
  {
    id: "it-1-1",
    unitId: "it-unit-1",
    languageId: "italian",
    title: "Ciao & Caffè",
    description: "Learn Italian greetings and how to order an espresso.",
    type: "standard",
    xp: 15,
    durationMinutes: 3,
    order: 1,
    goals: [], vocabulary: [], phrases: [], activities: [],
  },

  ...CURRICULUM_EXTENSIONS,
];

export function getLessons(): Lesson[] {
  return LESSONS;
}

export function getLessonsByUnit(unitId: string): Lesson[] {
  return LESSONS.filter((lesson) => lesson.unitId === unitId);
}

export function getLessonsByLanguage(languageId: string): Lesson[] {
  return LESSONS.filter((lesson) => lesson.languageId === languageId);
}

export function getLessonById(id: string): Lesson | undefined {
  return LESSONS.find((lesson) => lesson.id === id);
}

export function getLessonImageUrl(lesson: Lesson): string {
  return lesson.imageUrl ?? `https://picsum.photos/seed/${lesson.id}/400/300`;
}
