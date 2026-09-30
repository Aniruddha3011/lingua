import { Lesson, LessonGoal, Phrase, VocabularyItem } from "@/types/learning";

type LessonExtension = Pick<Lesson, "id" | "unitId" | "languageId" | "title" | "description" | "order"> & {
  word: string;
  translation: string;
  phonetic?: string;
  imageUrl?: string;
  goals?: LessonGoal[];
  vocabulary?: VocabularyItem[];
  phrases?: Phrase[];
  aiTeacherPrompt?: string;
};

function createPracticeLesson(entry: LessonExtension): Lesson {
  const defaultGoals: LessonGoal[] = entry.goals ?? [
    { id: `${entry.id}-goal-1`, description: `Recognize and pronounce “${entry.word}”`, xpReward: 5 },
    { id: `${entry.id}-goal-2`, description: "Practice natural conversational responses", xpReward: 10 },
  ];

  const defaultVocabulary: VocabularyItem[] = entry.vocabulary ?? [
    {
      id: `${entry.id}-word`,
      word: entry.word,
      translation: entry.translation,
      phonetic: entry.phonetic,
    },
  ];

  const defaultPhrases: Phrase[] = entry.phrases ?? [
    {
      id: `${entry.id}-phrase-1`,
      text: entry.word,
      translation: entry.translation,
      speaker: "teacher",
    },
  ];

  return {
    ...entry,
    type: "standard",
    xp: 15,
    durationMinutes: 3,
    imageUrl: entry.imageUrl ?? `https://picsum.photos/seed/${entry.id}/400/300`,
    goals: defaultGoals,
    vocabulary: defaultVocabulary,
    phrases: defaultPhrases,
    aiTeacherPrompt:
      entry.aiTeacherPrompt ??
      `You are Luna, a warm and encouraging AI teacher. Help the student practice "${entry.word}" (${entry.translation}) in natural conversation.`,
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
  // --- SPANISH EXTENSIONS ---
  createPracticeLesson({
    id: "es-1-4", unitId: "es-unit-3", languageId: "spanish", order: 4,
    title: "Travel & Directions", description: "Navigate cities, ask for directions, and buy transport tickets.",
    word: "¿Dónde está...?", translation: "Where is...?", phonetic: "dohn-deh ehs-tah",
    imageUrl: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&auto=format&fit=crop&q=80",
    aiTeacherPrompt: "You are Luna, an energetic Spanish tutor guiding the student through Barcelona. Help them ask for directions warmly!",
    goals: [
      { id: "es-1-4-g1", description: "Ask for directions using ¿Dónde está...?", xpReward: 5 },
      { id: "es-1-4-g2", description: "Practice city navigation vocabulary", xpReward: 10 },
    ],
    vocabulary: [
      { id: "es-1-4-v1", word: "¿Dónde está...?", translation: "Where is...?", phonetic: "dohn-deh ehs-tah" },
      { id: "es-1-4-v2", word: "El hotel", translation: "The hotel", phonetic: "ehl oh-tehl" },
    ],
    phrases: [
      { id: "es-1-4-p1", text: "Disculpe, ¿dónde está el hotel?", translation: "Excuse me, where is the hotel?", speaker: "teacher" },
    ],
  }),
  createPracticeLesson({
    id: "es-1-5", unitId: "es-unit-3", languageId: "spanish", order: 5,
    title: "Shopping", description: "Learn numbers, prices, and how to buy items at a market.",
    word: "¿Cuánto cuesta?", translation: "How much does it cost?", phonetic: "kwahn-toh kwehs-tah",
    imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&auto=format&fit=crop&q=80",
    aiTeacherPrompt: "You are Luna, helping the student shop for souvenirs at a colorful Spanish market in Seville.",
    goals: [
      { id: "es-1-5-g1", description: "Ask the price using ¿Cuánto cuesta?", xpReward: 5 },
      { id: "es-1-5-g2", description: "Practice market purchasing phrases", xpReward: 10 },
    ],
    vocabulary: [
      { id: "es-1-5-v1", word: "¿Cuánto cuesta?", translation: "How much does it cost?", phonetic: "kwahn-toh kwehs-tah" },
      { id: "es-1-5-v2", word: "Euro", translation: "Euro", phonetic: "eh-oo-roh" },
    ],
    phrases: [
      { id: "es-1-5-p1", text: "Hola, ¿cuánto cuesta esto?", translation: "Hello, how much does this cost?", speaker: "teacher" },
    ],
  }),
  createPracticeLesson({
    id: "es-1-6", unitId: "es-unit-3", languageId: "spanish", order: 6,
    title: "Family & Friends", description: "Talk about your family, friends, and daily routines.",
    word: "Mi familia", translation: "My family", phonetic: "mee fah-mee-lee-ah",
    imageUrl: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&auto=format&fit=crop&q=80",
    aiTeacherPrompt: "You are Luna, chatting warmly with the student about family, friends, and loved ones in Spanish.",
    goals: [
      { id: "es-1-6-g1", description: "Introduce your family members in Spanish", xpReward: 5 },
      { id: "es-1-6-g2", description: "Practice possessives like mi and tu", xpReward: 10 },
    ],
    vocabulary: [
      { id: "es-1-6-v1", word: "Mi familia", translation: "My family", phonetic: "mee fah-mee-lee-ah" },
      { id: "es-1-6-v2", word: "Amigo", translation: "Friend", phonetic: "ah-mee-goh" },
    ],
    phrases: [
      { id: "es-1-6-p1", text: "Te presento a mi familia.", translation: "Let me introduce you to my family.", speaker: "teacher" },
    ],
  }),

  // --- FRENCH EXTENSIONS ---
  createPracticeLesson({
    id: "fr-1-3", unitId: "fr-unit-1", languageId: "french", order: 3,
    title: "Introducing Yourself", description: "Share your name and ask someone theirs.",
    word: "Je m'appelle", translation: "My name is", phonetic: "zhuh mah-pehl",
    imageUrl: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&auto=format&fit=crop&q=80",
    aiTeacherPrompt: "You are Luna, a friendly French tutor in Paris helping the student introduce themselves gracefully.",
    goals: [
      { id: "fr-1-3-g1", description: "Say your name using Je m'appelle", xpReward: 5 },
      { id: "fr-1-3-g2", description: "Ask someone their name politely", xpReward: 10 },
    ],
    vocabulary: [
      { id: "fr-1-3-v1", word: "Je m'appelle", translation: "My name is", phonetic: "zhuh mah-pehl" },
      { id: "fr-1-3-v2", word: "Enchanté", translation: "Nice to meet you", phonetic: "ahn-shahn-tay" },
    ],
    phrases: [
      { id: "fr-1-3-p1", text: "Bonjour, je m'appelle Luna. Et vous ?", translation: "Hello, my name is Luna. And you?", speaker: "teacher" },
    ],
  }),
  createPracticeLesson({
    id: "fr-2-1", unitId: "fr-unit-2", languageId: "french", order: 4,
    title: "Ordering Coffee", description: "Order a coffee at a friendly French café.",
    word: "Un café", translation: "A coffee", phonetic: "uhn kah-fay",
    imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&auto=format&fit=crop&q=80",
    aiTeacherPrompt: "You are Luna, enjoying a sunny afternoon at a Montmartre café. Practice ordering drinks politely!",
    goals: [
      { id: "fr-2-1-g1", description: "Order coffee using s'il vous plaît", xpReward: 5 },
    ],
    vocabulary: [
      { id: "fr-2-1-v1", word: "Un café", translation: "A coffee", phonetic: "uhn kah-fay" },
      { id: "fr-2-1-v2", word: "S'il vous plaît", translation: "Please", phonetic: "seel voo play" },
    ],
    phrases: [
      { id: "fr-2-1-p1", text: "Un café s'il vous plaît.", translation: "A coffee please.", speaker: "teacher" },
    ],
  }),
  createPracticeLesson({
    id: "fr-2-2", unitId: "fr-unit-2", languageId: "french", order: 5,
    title: "At the Bakery", description: "Choose a pastry and thank the baker.",
    word: "Une baguette", translation: "A baguette", phonetic: "oon bah-geht",
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop&q=80",
    aiTeacherPrompt: "You are Luna, standing inside a warm Parisian boulangerie with fresh pastries everywhere.",
    goals: [
      { id: "fr-2-2-g1", description: "Order bread and pastries in French", xpReward: 5 },
    ],
    vocabulary: [
      { id: "fr-2-2-v1", word: "Une baguette", translation: "A baguette", phonetic: "oon bah-geht" },
      { id: "fr-2-2-v2", word: "Croissant", translation: "Croissant", phonetic: "kwah-sahn" },
    ],
    phrases: [
      { id: "fr-2-2-p1", text: "Une baguette et un croissant, merci !", translation: "A baguette and a croissant, thank you!", speaker: "teacher" },
    ],
  }),
  createPracticeLesson({
    id: "fr-2-3", unitId: "fr-unit-2", languageId: "french", order: 6,
    title: "Paying the Bill", description: "Ask for the bill and pay politely.",
    word: "L'addition", translation: "The bill", phonetic: "lah-dee-syohn",
    imageUrl: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=400&auto=format&fit=crop&q=80",
    aiTeacherPrompt: "You are Luna, teaching the student how to comfortably wrap up meals and pay at French restaurants.",
    goals: [
      { id: "fr-2-3-g1", description: "Ask for the check politely", xpReward: 5 },
    ],
    vocabulary: [
      { id: "fr-2-3-v1", word: "L'addition", translation: "The bill", phonetic: "lah-dee-syohn" },
    ],
    phrases: [
      { id: "fr-2-3-p1", text: "L'addition, s'il vous plaît !", translation: "The bill, please!", speaker: "teacher" },
    ],
  }),

  // --- GERMAN EXTENSIONS ---
  createPracticeLesson({
    id: "de-1-2", unitId: "de-unit-1", languageId: "german", order: 2,
    title: "Meeting Someone", description: "Introduce yourself and make a new friend.",
    word: "Ich heiße", translation: "My name is", phonetic: "ikh hy-suh",
    aiTeacherPrompt: "You are Luna, an enthusiastic German tutor in Berlin helping the student make their very first German friend!",
    goals: [
      { id: "de-1-2-g1", description: "Introduce yourself using Ich heiße", xpReward: 5 },
    ],
    vocabulary: [
      { id: "de-1-2-v1", word: "Ich heiße", translation: "My name is", phonetic: "ikh hy-suh" },
      { id: "de-1-2-v2", word: "Freut mich", translation: "Nice to meet you", phonetic: "froit mikh" },
    ],
    phrases: [
      { id: "de-1-2-p1", text: "Hallo! Ich heiße Luna, freut mich!", translation: "Hello! My name is Luna, nice to meet you!", speaker: "teacher" },
    ],
  }),
  createPracticeLesson({
    id: "de-1-3", unitId: "de-unit-1", languageId: "german", order: 3,
    title: "Please & Thank You", description: "Use polite words in everyday German.",
    word: "Bitte", translation: "Please", phonetic: "bi-tuh",
    aiTeacherPrompt: "You are Luna, guiding the student on polite German etiquette and essential daily courtesy.",
    goals: [
      { id: "de-1-3-g1", description: "Master German polite phrases like Bitte & Danke", xpReward: 5 },
    ],
    vocabulary: [
      { id: "de-1-3-v1", word: "Bitte", translation: "Please / You're welcome", phonetic: "bi-tuh" },
      { id: "de-1-3-v2", word: "Danke", translation: "Thank you", phonetic: "dahn-kuh" },
    ],
    phrases: [
      { id: "de-1-3-p1", text: "Danke schön! — Bitte sehr!", translation: "Thank you very much! — You are very welcome!", speaker: "teacher" },
    ],
  }),
  createPracticeLesson({
    id: "de-2-1", unitId: "de-unit-2", languageId: "german", order: 4,
    title: "Ordering a Drink", description: "Order a refreshing drink at a restaurant.",
    word: "Ein Wasser", translation: "A water", phonetic: "yn vahs-suh",
    aiTeacherPrompt: "You are Luna, sitting at a cozy Bavarian garden café. Practice ordering drinks with confidence!",
    goals: [
      { id: "de-2-1-g1", description: "Order beverages using Bitte", xpReward: 5 },
    ],
    vocabulary: [
      { id: "de-2-1-v1", word: "Ein Wasser", translation: "A water", phonetic: "yn vahs-suh" },
      { id: "de-2-1-v2", word: "Ein Kaffee", translation: "A coffee", phonetic: "yn kah-fay" },
    ],
    phrases: [
      { id: "de-2-1-p1", text: "Ein Wasser, bitte.", translation: "A water, please.", speaker: "teacher" },
    ],
  }),
  createPracticeLesson({
    id: "de-2-2", unitId: "de-unit-2", languageId: "german", order: 5,
    title: "Your Favorite Food", description: "Talk about food you enjoy.",
    word: "Ich mag", translation: "I like", phonetic: "ikh mahg",
    aiTeacherPrompt: "You are Luna, discussing favorite meals and food preferences in German with high energy!",
    goals: [
      { id: "de-2-2-g1", description: "Express likes using Ich mag", xpReward: 5 },
    ],
    vocabulary: [
      { id: "de-2-2-v1", word: "Ich mag", translation: "I like", phonetic: "ikh mahg" },
      { id: "de-2-2-v2", word: "Lecker", translation: "Delicious", phonetic: "leh-kuh" },
    ],
    phrases: [
      { id: "de-2-2-p1", text: "Ich mag Brezeln, das ist lecker!", translation: "I like pretzels, that's delicious!", speaker: "teacher" },
    ],
  }),
  createPracticeLesson({
    id: "de-2-3", unitId: "de-unit-2", languageId: "german", order: 6,
    title: "Paying at the Table", description: "Ask for the bill after your meal.",
    word: "Die Rechnung", translation: "The bill", phonetic: "dee rekh-noong",
    aiTeacherPrompt: "You are Luna, helping the student politely request the bill at a restaurant in Munich.",
    goals: [
      { id: "de-2-3-g1", description: "Ask for the check using Die Rechnung, bitte", xpReward: 5 },
    ],
    vocabulary: [
      { id: "de-2-3-v1", word: "Die Rechnung", translation: "The bill", phonetic: "dee rekh-noong" },
    ],
    phrases: [
      { id: "de-2-3-p1", text: "Die Rechnung, bitte!", translation: "The bill, please!", speaker: "teacher" },
    ],
  }),

  // --- JAPANESE EXTENSIONS ---
  createPracticeLesson({
    id: "ja-1-2", unitId: "ja-unit-1", languageId: "japanese", order: 2,
    title: "Nice to Meet You", description: "Make a warm first introduction in Japanese.",
    word: "はじめまして", translation: "Nice to meet you", phonetic: "Hajimemashite",
    aiTeacherPrompt: "You are Luna, a friendly Japanese language tutor in Tokyo helping the student introduce themselves politely.",
    goals: [
      { id: "ja-1-2-g1", description: "Master Hajimemashite for first meetings", xpReward: 5 },
    ],
    vocabulary: [
      { id: "ja-1-2-v1", word: "はじめまして", translation: "Nice to meet you", phonetic: "Hajimemashite" },
      { id: "ja-1-2-v2", word: "よろしく", translation: "Pleased to work with you", phonetic: "Yoroshiku" },
    ],
    phrases: [
      { id: "ja-1-2-p1", text: "はじめまして、ルナです！", translation: "Nice to meet you, I am Luna!", speaker: "teacher" },
    ],
  }),
  createPracticeLesson({
    id: "ja-1-3", unitId: "ja-unit-1", languageId: "japanese", order: 3,
    title: "My Name Is...", description: "Say your name clearly and politely.",
    word: "わたしは", translation: "I am", phonetic: "Watashi wa",
    aiTeacherPrompt: "You are Luna, helping the student build self-confidence stating their name in Japanese.",
    goals: [
      { id: "ja-1-3-g1", description: "Say your name using Watashi wa ... desu", xpReward: 5 },
    ],
    vocabulary: [
      { id: "ja-1-3-v1", word: "わたしは", translation: "I am", phonetic: "Watashi wa" },
      { id: "ja-1-3-v2", word: "です", translation: "Am / Is / Are (polite)", phonetic: "desu" },
    ],
    phrases: [
      { id: "ja-1-3-p1", text: "わたしは学生です。", translation: "I am a student.", speaker: "teacher" },
    ],
  }),
  createPracticeLesson({
    id: "ja-2-1", unitId: "ja-unit-2", languageId: "japanese", order: 4,
    title: "A Bowl of Ramen", description: "Order a delicious bowl of ramen.",
    word: "ラーメン", translation: "Ramen", phonetic: "Raamen",
    aiTeacherPrompt: "You are Luna, ordering delicious ramen with the student in a cozy Shibuya ramen shop!",
    goals: [
      { id: "ja-2-1-g1", description: "Order food using Kudasai", xpReward: 5 },
    ],
    vocabulary: [
      { id: "ja-2-1-v1", word: "ラーメン", translation: "Ramen", phonetic: "Raamen" },
      { id: "ja-2-1-v2", word: "ください", translation: "Please give me", phonetic: "Kudasai" },
    ],
    phrases: [
      { id: "ja-2-1-p1", text: "ラーメンをひとつ、ください！", translation: "One bowl of ramen, please!", speaker: "teacher" },
    ],
  }),
  createPracticeLesson({
    id: "ja-2-2", unitId: "ja-unit-2", languageId: "japanese", order: 5,
    title: "Something to Drink", description: "Ask for tea or water at a restaurant.",
    word: "お水", translation: "Water", phonetic: "Omizu",
    aiTeacherPrompt: "You are Luna, teaching polite restaurant beverage requests in Tokyo.",
    goals: [
      { id: "ja-2-2-g1", description: "Ask for water or green tea politely", xpReward: 5 },
    ],
    vocabulary: [
      { id: "ja-2-2-v1", word: "お水", translation: "Water", phonetic: "Omizu" },
      { id: "ja-2-2-v2", word: "お茶", translation: "Green tea", phonetic: "Ocha" },
    ],
    phrases: [
      { id: "ja-2-2-p1", text: "お水をお願いします。", translation: "Water, please.", speaker: "teacher" },
    ],
  }),
  createPracticeLesson({
    id: "ja-2-3", unitId: "ja-unit-2", languageId: "japanese", order: 6,
    title: "The Check, Please", description: "Finish your meal with a polite request.",
    word: "お会計", translation: "The check", phonetic: "Okaikei",
    aiTeacherPrompt: "You are Luna, teaching Japanese dining etiquette for finishing meals and asking for the check.",
    goals: [
      { id: "ja-2-3-g1", description: "Request the check using Okaikei", xpReward: 5 },
    ],
    vocabulary: [
      { id: "ja-2-3-v1", word: "お会計", translation: "The check", phonetic: "Okaikei" },
      { id: "ja-2-3-v2", word: "ごちそうさま", translation: "Thank you for the meal", phonetic: "Gochisosama" },
    ],
    phrases: [
      { id: "ja-2-3-p1", text: "お会計をお願いします！", translation: "The check, please!", speaker: "teacher" },
    ],
  }),

  // --- KOREAN EXTENSIONS ---
  createPracticeLesson({
    id: "ko-1-1", unitId: "ko-unit-1", languageId: "korean", order: 1,
    title: "Hello & Thank You", description: "Learn basic Korean greetings like Annyeonghaseyo.",
    word: "안녕하세요", translation: "Hello", phonetic: "Annyeonghaseyo",
    aiTeacherPrompt: "You are Luna, an upbeat Korean language tutor in Seoul helping the student master core greetings!",
    goals: [
      { id: "ko-1-1-g1", description: "Greet people politely using Annyeonghaseyo", xpReward: 5 },
    ],
    vocabulary: [
      { id: "ko-1-1-v1", word: "안녕하세요", translation: "Hello", phonetic: "Annyeonghaseyo" },
      { id: "ko-1-1-v2", word: "감사합니다", translation: "Thank you", phonetic: "Gamsahabnida" },
    ],
    phrases: [
      { id: "ko-1-1-p1", text: "안녕하세요! 만나서 반갑습니다.", translation: "Hello! Nice to meet you.", speaker: "teacher" },
    ],
  }),
  createPracticeLesson({
    id: "ko-1-2", unitId: "ko-unit-1", languageId: "korean", order: 2,
    title: "Nice to Meet You", description: "Introduce yourself politely in Korean.",
    word: "반갑습니다", translation: "Nice to meet you", phonetic: "Bangapseumnida",
    aiTeacherPrompt: "You are Luna, guiding the student on warm Korean introductions.",
    goals: [
      { id: "ko-1-2-g1", description: "Say Bangapseumnida to new acquaintances", xpReward: 5 },
    ],
    vocabulary: [
      { id: "ko-1-2-v1", word: "반갑습니다", translation: "Nice to meet you", phonetic: "Bangapseumnida" },
    ],
    phrases: [
      { id: "ko-1-2-p1", text: "저는 루나입니다. 반갑습니다!", translation: "I am Luna. Nice to meet you!", speaker: "teacher" },
    ],
  }),
  createPracticeLesson({
    id: "ko-1-3", unitId: "ko-unit-1", languageId: "korean", order: 3,
    title: "Yes & No", description: "Master basic agreement and polite responses.",
    word: "네 / 아니요", translation: "Yes / No", phonetic: "Ne / Aniyo",
    aiTeacherPrompt: "You are Luna, teaching basic agreement and polite responses in Korean.",
    goals: [
      { id: "ko-1-3-g1", description: "Use Ne and Aniyo appropriately", xpReward: 5 },
    ],
    vocabulary: [
      { id: "ko-1-3-v1", word: "네", translation: "Yes", phonetic: "Ne" },
      { id: "ko-1-3-v2", word: "아니요", translation: "No", phonetic: "Aniyo" },
    ],
    phrases: [
      { id: "ko-1-3-p1", text: "네, 맞아요!", translation: "Yes, that's right!", speaker: "teacher" },
    ],
  }),
  createPracticeLesson({
    id: "ko-2-1", unitId: "ko-unit-2", languageId: "korean", order: 4,
    title: "Ordering Delicious Food", description: "Order K-food at a restaurant.",
    word: "주세요", translation: "Please give me", phonetic: "Juseyo",
    aiTeacherPrompt: "You are Luna, ordering Korean street food with the student in Hongdae!",
    goals: [
      { id: "ko-2-1-g1", description: "Order items using Juseyo", xpReward: 5 },
    ],
    vocabulary: [
      { id: "ko-2-1-v1", word: "주세요", translation: "Please give me", phonetic: "Juseyo" },
      { id: "ko-2-1-v2", word: "맛있어요", translation: "It's delicious", phonetic: "Masisseoyo" },
    ],
    phrases: [
      { id: "ko-2-1-p1", text: "이거 주세요, 정말 맛있어요!", translation: "Please give me this, it's really delicious!", speaker: "teacher" },
    ],
  }),
  createPracticeLesson({
    id: "ko-2-2", unitId: "ko-unit-2", languageId: "korean", order: 5,
    title: "Coffee & Drinks", description: "Order iced americano and tea.",
    word: "커피", translation: "Coffee", phonetic: "Keopi",
    aiTeacherPrompt: "You are Luna, ordering iced americano with the student at a modern café in Seoul.",
    goals: [
      { id: "ko-2-2-g1", description: "Order coffee drinks in Korean", xpReward: 5 },
    ],
    vocabulary: [
      { id: "ko-2-2-v1", word: "커피", translation: "Coffee", phonetic: "Keopi" },
      { id: "ko-2-2-v2", word: "아메리카노", translation: "Americano", phonetic: "Amerikano" },
    ],
    phrases: [
      { id: "ko-2-2-p1", text: "아이스 아메리카노 하나 주세요!", translation: "One iced americano please!", speaker: "teacher" },
    ],
  }),
  createPracticeLesson({
    id: "ko-2-3", unitId: "ko-unit-2", languageId: "korean", order: 6,
    title: "Asking the Price", description: "Ask how much an item costs.",
    word: "얼마예요?", translation: "How much is it?", phonetic: "Eolmayeyo?",
    aiTeacherPrompt: "You are Luna, practicing shopping and price inquiries in Korean.",
    goals: [
      { id: "ko-2-3-g1", description: "Ask price using Eolmayeyo?", xpReward: 5 },
    ],
    vocabulary: [
      { id: "ko-2-3-v1", word: "얼마예요?", translation: "How much is it?", phonetic: "Eolmayeyo?" },
    ],
    phrases: [
      { id: "ko-2-3-p1", text: "저기요, 이거 얼마예요?", translation: "Excuse me, how much is this?", speaker: "teacher" },
    ],
  }),

  // --- CHINESE EXTENSIONS ---
  createPracticeLesson({
    id: "zh-1-1", unitId: "zh-unit-1", languageId: "chinese", order: 1,
    title: "Ni Hao & Goodbye", description: "Learn basic Mandarin greetings.",
    word: "你好", translation: "Hello", phonetic: "Nǐ hǎo",
    aiTeacherPrompt: "You are Luna, an encouraging Mandarin Chinese teacher in Beijing guiding the student on essential greetings!",
    goals: [
      { id: "zh-1-1-g1", description: "Say Ni hao and Zaijian clearly", xpReward: 5 },
    ],
    vocabulary: [
      { id: "zh-1-1-v1", word: "你好", translation: "Hello", phonetic: "Nǐ hǎo" },
      { id: "zh-1-1-v2", word: "再见", translation: "Goodbye", phonetic: "Zàijiàn" },
    ],
    phrases: [
      { id: "zh-1-1-p1", text: "你好！很高兴见到你。", translation: "Hello! Very happy to meet you.", speaker: "teacher" },
    ],
  }),
  createPracticeLesson({
    id: "zh-1-2", unitId: "zh-unit-1", languageId: "chinese", order: 2,
    title: "Thank You Very Much", description: "Say thank you and you're welcome.",
    word: "谢谢", translation: "Thank you", phonetic: "Xièxie",
    aiTeacherPrompt: "You are Luna, teaching politeness and gratitude in Mandarin Chinese.",
    goals: [
      { id: "zh-1-2-g1", description: "Master Xiexie and Bu keqi", xpReward: 5 },
    ],
    vocabulary: [
      { id: "zh-1-2-v1", word: "谢谢", translation: "Thank you", phonetic: "Xièxie" },
      { id: "zh-1-2-v2", word: "不客气", translation: "You're welcome", phonetic: "Bú kèqi" },
    ],
    phrases: [
      { id: "zh-1-2-p1", text: "非常感谢！— 不客气！", translation: "Thank you very much! — You're welcome!", speaker: "teacher" },
    ],
  }),
  createPracticeLesson({
    id: "zh-1-3", unitId: "zh-unit-1", languageId: "chinese", order: 3,
    title: "What is Your Name?", description: "Ask and answer names in Chinese.",
    word: "你叫什么名字？", translation: "What is your name?", phonetic: "Nǐ jiào shénme míngzi?",
    aiTeacherPrompt: "You are Luna, practicing asking and introducing names in Mandarin.",
    goals: [
      { id: "zh-1-3-g1", description: "Ask and state names in Chinese", xpReward: 5 },
    ],
    vocabulary: [
      { id: "zh-1-3-v1", word: "你叫什么名字？", translation: "What is your name?", phonetic: "Nǐ jiào shénme míngzi?" },
      { id: "zh-1-3-v2", word: "我叫", translation: "My name is", phonetic: "Wǒ jiào" },
    ],
    phrases: [
      { id: "zh-1-3-p1", text: "你好，我叫 Luna，你呢？", translation: "Hello, my name is Luna, and you?", speaker: "teacher" },
    ],
  }),
  createPracticeLesson({
    id: "zh-2-1", unitId: "zh-unit-2", languageId: "chinese", order: 4,
    title: "Ordering Green Tea", description: "Enjoy tea culture and order drinks.",
    word: "茶", translation: "Tea", phonetic: "Chá",
    aiTeacherPrompt: "You are Luna, exploring traditional tea culture with the student in a peaceful Hangzhou teahouse.",
    goals: [
      { id: "zh-2-1-g1", description: "Order tea drinks in Mandarin", xpReward: 5 },
    ],
    vocabulary: [
      { id: "zh-2-1-v1", word: "茶", translation: "Tea", phonetic: "Chá" },
      { id: "zh-2-1-v2", word: "请", translation: "Please", phonetic: "Qǐng" },
    ],
    phrases: [
      { id: "zh-2-1-p1", text: "请给我一杯绿茶，谢谢。", translation: "Please give me a cup of green tea, thank you.", speaker: "teacher" },
    ],
  }),
  createPracticeLesson({
    id: "zh-2-2", unitId: "zh-unit-2", languageId: "chinese", order: 5,
    title: "Eating Dumplings", description: "Order delicious food at a restaurant.",
    word: "饺子", translation: "Dumplings", phonetic: "Jiǎozi",
    aiTeacherPrompt: "You are Luna, ordering dim sum and dumplings with the student in Shanghai!",
    goals: [
      { id: "zh-2-2-g1", description: "Order food and express deliciousness in Chinese", xpReward: 5 },
    ],
    vocabulary: [
      { id: "zh-2-2-v1", word: "饺子", translation: "Dumplings", phonetic: "Jiǎozi" },
      { id: "zh-2-2-v2", word: "好吃", translation: "Delicious", phonetic: "Hǎochī" },
    ],
    phrases: [
      { id: "zh-2-2-p1", text: "这盘饺子真好吃！", translation: "This plate of dumplings is so delicious!", speaker: "teacher" },
    ],
  }),
  createPracticeLesson({
    id: "zh-2-3", unitId: "zh-unit-2", languageId: "chinese", order: 6,
    title: "Asking for the Bill", description: "Pay for your meal politely.",
    word: "买单", translation: "Pay the bill", phonetic: "Mǎidān",
    aiTeacherPrompt: "You are Luna, guiding the student on paying for meals politely in Mandarin.",
    goals: [
      { id: "zh-2-3-g1", description: "Request the bill using Maidān", xpReward: 5 },
    ],
    vocabulary: [
      { id: "zh-2-3-v1", word: "买单", translation: "Pay the bill", phonetic: "Mǎidān" },
    ],
    phrases: [
      { id: "zh-2-3-p1", text: "服务员，买单，谢谢！", translation: "Waiter, bill please, thank you!", speaker: "teacher" },
    ],
  }),

  // --- ITALIAN EXTENSIONS ---
  createPracticeLesson({
    id: "it-1-2", unitId: "it-unit-1", languageId: "italian", order: 2,
    title: "Introducing Yourself", description: "Say your name and meet someone new.",
    word: "Mi chiamo", translation: "My name is", phonetic: "mee kyah-moh",
    aiTeacherPrompt: "You are Luna, a passionate Italian tutor in Rome helping the student introduce themselves warmly.",
    goals: [
      { id: "it-1-2-g1", description: "State your name using Mi chiamo", xpReward: 5 },
    ],
    vocabulary: [
      { id: "it-1-2-v1", word: "Mi chiamo", translation: "My name is", phonetic: "mee kyah-moh" },
      { id: "it-1-2-v2", word: "Piacere", translation: "Nice to meet you", phonetic: "pyah-cheh-reh" },
    ],
    phrases: [
      { id: "it-1-2-p1", text: "Ciao! Mi chiamo Luna, piacere!", translation: "Hi! My name is Luna, nice to meet you!", speaker: "teacher" },
    ],
  }),
  createPracticeLesson({
    id: "it-1-3", unitId: "it-unit-1", languageId: "italian", order: 3,
    title: "Please & Thank You", description: "Use kind words in everyday conversation.",
    word: "Per favore", translation: "Please", phonetic: "pehr fah-voh-reh",
    aiTeacherPrompt: "You are Luna, teaching everyday Italian courtesy and polite expressions.",
    goals: [
      { id: "it-1-3-g1", description: "Use Per favore and Grazie mille", xpReward: 5 },
    ],
    vocabulary: [
      { id: "it-1-3-v1", word: "Per favore", translation: "Please", phonetic: "pehr fah-voh-reh" },
      { id: "it-1-3-v2", word: "Grazie mille", translation: "Thank you very much", phonetic: "grah-tsyee meel-leh" },
    ],
    phrases: [
      { id: "it-1-3-p1", text: "Grazie mille per l'aiuto!", translation: "Thank you so much for the help!", speaker: "teacher" },
    ],
  }),
  createPracticeLesson({
    id: "it-2-1", unitId: "it-unit-2", languageId: "italian", order: 4,
    title: "At the Gelateria", description: "Choose your favorite flavor of gelato.",
    word: "Un gelato", translation: "An ice cream", phonetic: "oon jeh-lah-toh",
    aiTeacherPrompt: "You are Luna, standing at a famous gelateria in Florence. Practice ordering gelato flavors!",
    goals: [
      { id: "it-2-1-g1", description: "Order gelato flavors in Italian", xpReward: 5 },
    ],
    vocabulary: [
      { id: "it-2-1-v1", word: "Un gelato", translation: "An ice cream", phonetic: "oon jeh-lah-toh" },
      { id: "it-2-1-v2", word: "Pistacchio", translation: "Pistachio", phonetic: "pees-tahk-kyoh" },
    ],
    phrases: [
      { id: "it-2-1-p1", text: "Un gelato al pistacchio, per favore!", translation: "A pistachio ice cream, please!", speaker: "teacher" },
    ],
  }),
  createPracticeLesson({
    id: "it-2-2", unitId: "it-unit-2", languageId: "italian", order: 5,
    title: "Finding a Table", description: "Ask for a table at a restaurant.",
    word: "Un tavolo", translation: "A table", phonetic: "oon tah-voh-loh",
    aiTeacherPrompt: "You are Luna, helping the student get seated at a rustic Italian trattoria.",
    goals: [
      { id: "it-2-2-g1", description: "Ask for a table using Per favore", xpReward: 5 },
    ],
    vocabulary: [
      { id: "it-2-2-v1", word: "Un tavolo", translation: "A table", phonetic: "oon tah-voh-loh" },
      { id: "it-2-2-v2", word: "Per due", translation: "For two", phonetic: "pehr doo-eh" },
    ],
    phrases: [
      { id: "it-2-2-p1", text: "Buonasera, un tavolo per due per favore.", translation: "Good evening, a table for two please.", speaker: "teacher" },
    ],
  }),
  createPracticeLesson({
    id: "it-2-3", unitId: "it-unit-2", languageId: "italian", order: 6,
    title: "See You Soon", description: "End a conversation with a friendly goodbye.",
    word: "A presto", translation: "See you soon", phonetic: "ah prehs-toh",
    aiTeacherPrompt: "You are Luna, concluding Italian conversations with friendly goodbyes.",
    goals: [
      { id: "it-2-3-g1", description: "Say goodbye using A presto and Arrivederci", xpReward: 5 },
    ],
    vocabulary: [
      { id: "it-2-3-v1", word: "A presto", translation: "See you soon", phonetic: "ah prehs-toh" },
      { id: "it-2-3-v2", word: "Arrivederci", translation: "Goodbye", phonetic: "ahr-ree-veh-dehr-chee" },
    ],
    phrases: [
      { id: "it-2-3-p1", text: "Grazie di tutto, a presto!", translation: "Thanks for everything, see you soon!", speaker: "teacher" },
    ],
  }),
];

export const LESSONS: Lesson[] = [
  // --- SPANISH LESSONS ---
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
    aiTeacherPrompt: "You are Luna, a warm and energetic Spanish teacher in Madrid! Teach basic greetings warmly with high energy.",
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
    aiTeacherPrompt: "You are Luna, practicing self-introductions and daily expressions with the student in Spanish.",
    goals: [
      { id: "g3", description: "Practice self-introductions in audio format", xpReward: 10 },
    ],
    vocabulary: [
      { id: "v5", word: "Me llamo", translation: "My name is", phonetic: "meh yah-moh" },
      { id: "v6", word: "¿Cómo estás?", translation: "How are you?", phonetic: "koh-moh ehs-tahs" },
    ],
    phrases: [
      { id: "p2", text: "Me llamo Luna, ¿cómo estás?", translation: "My name is Luna, how are you?", speaker: "teacher" },
    ],
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
    aiTeacherPrompt: "You are Luna, a friendly AI Spanish teacher at a cozy café in Madrid. Help the student order coffee!",
    goals: [
      { id: "g5", description: "Converse in Spanish with your AI Teacher at the café", xpReward: 15 },
    ],
    vocabulary: [
      { id: "v8", word: "Un café", translation: "A coffee", phonetic: "oon kah-feh" },
      { id: "v9", word: "Por favor", translation: "Please", phonetic: "pohr fah-vohr" },
    ],
    phrases: [
      { id: "p3", text: "Un café por favor.", translation: "A coffee please.", speaker: "teacher" },
    ],
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
    aiTeacherPrompt: "You are Luna, a warm French teacher in Paris introducing core greetings like Bonjour and Merci!",
    goals: [
      { id: "fr-1-1-g1", description: "Greet people with Bonjour and thank them with Merci", xpReward: 10 },
    ],
    vocabulary: [
      { id: "fr-1-1-v1", word: "Bonjour", translation: "Hello / Good morning", phonetic: "bohn-zhoor" },
      { id: "fr-1-1-v2", word: "Merci", translation: "Thank you", phonetic: "mair-see" },
    ],
    phrases: [
      { id: "fr-1-1-p1", text: "Bonjour ! Comment allez-vous ?", translation: "Hello! How are you?", speaker: "teacher" },
    ],
    activities: [],
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
    aiTeacherPrompt: "You are Luna, practicing daily polite phrases with the student in Paris.",
    goals: [
      { id: "fr-1-2-g1", description: "Practice conversational French polite terms", xpReward: 10 },
    ],
    vocabulary: [
      { id: "fr-1-2-v1", word: "Ça va", translation: "How's it going? / I'm good", phonetic: "sah vah" },
    ],
    phrases: [
      { id: "fr-1-2-p1", text: "Ça va très bien, merci !", translation: "It's going very well, thank you!", speaker: "teacher" },
    ],
    activities: [],
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
    aiTeacherPrompt: "You are Luna, an enthusiastic German teacher in Berlin teaching friendly greetings!",
    goals: [
      { id: "de-1-1-g1", description: "Master Hallo, Guten Tag, and Tschüss", xpReward: 10 },
    ],
    vocabulary: [
      { id: "de-1-1-v1", word: "Hallo", translation: "Hello", phonetic: "hah-loh" },
      { id: "de-1-1-v2", word: "Guten Tag", translation: "Good day", phonetic: "goo-ten tahk" },
      { id: "de-1-1-v3", word: "Tschüss", translation: "Goodbye", phonetic: "tshoos" },
    ],
    phrases: [
      { id: "de-1-1-p1", text: "Guten Tag! Wie geht es Ihnen?", translation: "Good day! How are you?", speaker: "teacher" },
    ],
    activities: [],
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
    aiTeacherPrompt: "You are Luna, a cheerful Japanese teacher in Tokyo teaching Konnichiwa and Arigatou!",
    goals: [
      { id: "ja-1-1-g1", description: "Pronounce Konnichiwa and Arigatou with confidence", xpReward: 10 },
    ],
    vocabulary: [
      { id: "ja-1-1-v1", word: "こんにちは", translation: "Hello", phonetic: "Konnichiwa" },
      { id: "ja-1-1-v2", word: "ありがとう", translation: "Thank you", phonetic: "Arigatou" },
    ],
    phrases: [
      { id: "ja-1-1-p1", text: "こんにちは！お元気ですか？", translation: "Hello! How are you?", speaker: "teacher" },
    ],
    activities: [],
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
    aiTeacherPrompt: "You are Luna, a passionate Italian teacher in Rome introducing Ciao and Caffè!",
    goals: [
      { id: "it-1-1-g1", description: "Greet people with Ciao and order an espresso", xpReward: 10 },
    ],
    vocabulary: [
      { id: "it-1-1-v1", word: "Ciao", translation: "Hello / Goodbye", phonetic: "chow" },
      { id: "it-1-1-v2", word: "Un caffè", translation: "A coffee", phonetic: "oon kahf-feh" },
    ],
    phrases: [
      { id: "it-1-1-p1", text: "Ciao! Un caffè per favore.", translation: "Hi! A coffee please.", speaker: "teacher" },
    ],
    activities: [],
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
