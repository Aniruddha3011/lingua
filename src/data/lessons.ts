import { Lesson } from "@/types/learning";

export const LESSONS: Lesson[] = [
  // --- SPANISH LESSONS ---
  // Unit 1: Greetings & Basics
  {
    id: "es-1-1",
    unitId: "es-unit-1",
    languageId: "spanish",
    title: "Saying Hello & Goodbye",
    description: "Learn essential Spanish greetings like Hola, Buenos d\u00edas, and Adi\u00f3s.",
    type: "standard",
    xp: 15,
    durationMinutes: 3,
    order: 1,
    goals: [
      { id: "g1", description: "Recognize 4 basic Spanish greetings", xpReward: 5 },
      { id: "g2", description: "Complete all matching & translation exercises", xpReward: 10 },
    ],
    vocabulary: [
      {
        id: "v1",
        word: "Hola",
        translation: "Hello / Hi",
        phonetic: "oh-lah",
        partOfSpeech: "phrase",
        exampleSentence: "\u00a1Hola! \u00bfC\u00f3mo est\u00e1s?",
        exampleTranslation: "Hello! How are you?",
      },
      {
        id: "v2",
        word: "Buenos d\u00edas",
        translation: "Good morning",
        phonetic: "bweh-nohs dee-ahs",
        partOfSpeech: "phrase",
        exampleSentence: "Buenos d\u00edas, \u00bfqu\u00e9 tal?",
        exampleTranslation: "Good morning, how are things?",
      },
      {
        id: "v3",
        word: "Buenas noches",
        translation: "Good evening / Good night",
        phonetic: "bweh-nahs noh-chehs",
        partOfSpeech: "phrase",
        exampleSentence: "Buenas noches, hasta ma\u00f1ana.",
        exampleTranslation: "Good night, see you tomorrow.",
      },
      {
        id: "v4",
        word: "Adi\u00f3s",
        translation: "Goodbye",
        phonetic: "ah-dee-ohs",
        partOfSpeech: "phrase",
        exampleSentence: "Adi\u00f3s, amigo.",
        exampleTranslation: "Goodbye, my friend.",
      },
    ],
    phrases: [
      { id: "p1", text: "\u00a1Hola! \u00bfC\u00f3mo te llamas?", translation: "Hello! What is your name?", speaker: "teacher" },
      { id: "p2", text: "Me llamo Alex.", translation: "My name is Alex.", speaker: "student" },
    ],
    activities: [
      {
        id: "a1",
        type: "multiple-choice",
        prompt: "How do you say 'Hello' in Spanish?",
        options: ["Hola", "Adi\u00f3s", "Gracias", "Por favor"],
        correctAnswer: "Hola",
        explanation: "'Hola' means Hello in Spanish.",
      },
      {
        id: "a2",
        type: "matching",
        prompt: "Match the Spanish greetings with their English translations.",
        matchingPairs: [
          { id: "mp1", left: "Hola", right: "Hello" },
          { id: "mp2", left: "Buenos d\u00edas", right: "Good morning" },
          { id: "mp3", left: "Buenas noches", right: "Good night" },
          { id: "mp4", left: "Adi\u00f3s", right: "Goodbye" },
        ],
      },
      {
        id: "a3",
        type: "fill-in-the-blank",
        prompt: "Complete the sentence: '____ d\u00edas, \u00bfc\u00f3mo est\u00e1s?'",
        options: ["Buenos", "Adi\u00f3s", "Gracias"],
        correctAnswer: "Buenos",
        explanation: "'Buenos d\u00edas' means Good morning.",
      },
    ],
  },
  {
    id: "es-1-2",
    unitId: "es-unit-1",
    languageId: "spanish",
    title: "Introducing Yourself",
    description: "Learn how to state your name, ask how someone is, and say nice to meet you.",
    type: "audio",
    xp: 20,
    durationMinutes: 4,
    order: 2,
    goals: [
      { id: "g3", description: "Practice self-introductions in audio format", xpReward: 10 },
      { id: "g4", description: "Master 'Me llamo' and 'Mucho gusto'", xpReward: 10 },
    ],
    vocabulary: [
      {
        id: "v5",
        word: "Me llamo",
        translation: "My name is",
        phonetic: "meh yah-moh",
        partOfSpeech: "phrase",
        exampleSentence: "Me llamo Maria.",
        exampleTranslation: "My name is Maria.",
      },
      {
        id: "v6",
        word: "Mucho gusto",
        translation: "Nice to meet you",
        phonetic: "moo-choh goos-toh",
        partOfSpeech: "phrase",
        exampleSentence: "Mucho gusto en conocerte.",
        exampleTranslation: "Nice to meet you.",
      },
      {
        id: "v7",
        word: "\u00bfC\u00f3mo est\u00e1s?",
        translation: "How are you?",
        phonetic: "koh-moh ehs-tahs",
        partOfSpeech: "phrase",
        exampleSentence: "\u00a1Hola! \u00bfC\u00f3mo est\u00e1s?",
        exampleTranslation: "Hello! How are you?",
      },
    ],
    phrases: [
      { id: "p3", text: "Me llamo Carlos. \u00bfY t\u00fa?", translation: "My name is Carlos. And you?", speaker: "teacher" },
      { id: "p4", text: "Mucho gusto, Carlos.", translation: "Nice to meet you, Carlos.", speaker: "student" },
    ],
    activities: [
      {
        id: "a4",
        type: "audio-lesson",
        prompt: "Listen to the introduction dialogue and select the correct response.",
        options: ["Mucho gusto", "Buenas noches", "Por favor"],
        correctAnswer: "Mucho gusto",
        audioUrl: "https://example.com/audio/es-intro.mp3",
      },
      {
        id: "a5",
        type: "multiple-choice",
        prompt: "What does 'Mucho gusto' mean?",
        options: ["Nice to meet you", "See you tomorrow", "Good morning", "Thank you very much"],
        correctAnswer: "Nice to meet you",
      },
    ],
  },
  {
    id: "es-1-3",
    unitId: "es-unit-1",
    languageId: "spanish",
    title: "AI Teacher: First Conversation",
    description: "Have a real-time voice lesson with Sofia, your AI Spanish teacher!",
    type: "video-teacher",
    xp: 30,
    durationMinutes: 5,
    order: 3,
    aiTeacherPrompt:
      "You are Sofia, a friendly, encouraging AI Spanish teacher. Greet the student warmly in Spanish and ask for their name using 'Hola, ¿cómo te llamas?'. Help them practice introducing themselves, using simple Spanish words like 'Me llamo', 'Mucho gusto', and '¿Cómo estás?'. If the student makes a mistake, gently correct them in English and encourage them to repeat in Spanish.",
    goals: [
      { id: "g5", description: "Converse in Spanish with your AI Teacher", xpReward: 15 },
      { id: "g6", description: "Complete a full 2-minute dialogue session", xpReward: 15 },
    ],
    vocabulary: [
      { id: "v8", word: "Por favor", translation: "Please", phonetic: "pohr fah-vohr" },
      { id: "v9", word: "Gracias", translation: "Thank you", phonetic: "grah-see-ahs" },
      { id: "v10", word: "De nada", translation: "You're welcome", phonetic: "deh nah-dah" },
    ],
    phrases: [
      { id: "p5", text: "\u00a1Hola! Soy Sofia, tu profesora de espa\u00f1ol.", translation: "Hello! I am Sofia, your Spanish teacher.", speaker: "teacher" },
      { id: "p6", text: "\u00a1Hola Sofia! Encantado de conocerte.", translation: "Hello Sofia! Delighted to meet you.", speaker: "student" },
    ],
    activities: [
      {
        id: "a6",
        type: "video-teacher",
        prompt: "Start your live AI Teacher session with Sofia. Speak naturally and practice your Spanish greetings!",
        aiTeacherPrompt:
          "You are Sofia, an AI Spanish teacher. Practice basic greetings and introductions with the student.",
      },
    ],
  },

  // Unit 2: Food & Dining Out
  {
    id: "es-2-1",
    unitId: "es-unit-2",
    languageId: "spanish",
    title: "Ordering Drinks & Coffee",
    description: "Learn how to order agua, caf\u00e9, y cerveza at a caf\u00e9.",
    type: "standard",
    xp: 20,
    durationMinutes: 4,
    order: 1,
    goals: [
      { id: "g7", description: "Learn 5 beverage words in Spanish", xpReward: 10 },
      { id: "g8", description: "Order drinks using 'Quisiera' or 'Un... por favor'", xpReward: 10 },
    ],
    vocabulary: [
      { id: "v11", word: "Un caf\u00e9", translation: "A coffee", phonetic: "oon kah-feh" },
      { id: "v12", word: "Agua", translation: "Water", phonetic: "ah-gwah" },
      { id: "v13", word: "Una cerveza", translation: "A beer", phonetic: "oo-nah sehr-veh-sah" },
      { id: "v14", word: "La cuenta", translation: "The bill / check", phonetic: "lah kwen-tah" },
    ],
    phrases: [
      { id: "p7", text: "Un caf\u00e9 con leche, por favor.", translation: "A coffee with milk, please.", speaker: "student" },
      { id: "p8", text: "\u00bfAlgo m\u00e1s?", translation: "Anything else?", speaker: "teacher" },
    ],
    activities: [
      {
        id: "a7",
        type: "multiple-choice",
        prompt: "How do you order 'A coffee, please' in Spanish?",
        options: ["Un caf\u00e9, por favor", "Una cerveza, gracias", "Hola, me llamo Caf\u00e9", "Buenas noches"],
        correctAnswer: "Un caf\u00e9, por favor",
      },
    ],
  },

  // --- FRENCH LESSONS ---
  // Unit 1: Essential Greetings
  {
    id: "fr-1-1",
    unitId: "fr-unit-1",
    languageId: "french",
    title: "French Greetings & Courtesy",
    description: "Learn Bonjour, Bonsoir, Merci, and S'il vous pla\u00eet.",
    type: "standard",
    xp: 15,
    durationMinutes: 3,
    order: 1,
    goals: [
      { id: "fg1", description: "Learn basic polite French greetings", xpReward: 5 },
      { id: "fg2", description: "Complete matching exercises", xpReward: 10 },
    ],
    vocabulary: [
      { id: "fv1", word: "Bonjour", translation: "Hello / Good day", phonetic: "bohn-zhoor" },
      { id: "fv2", word: "Merci", translation: "Thank you", phonetic: "mehr-see" },
      { id: "fv3", word: "Au revoir", translation: "Goodbye", phonetic: "oh ruh-vwahr" },
      { id: "fv4", word: "S'il vous pla\u00eet", translation: "Please", phonetic: "seel voo pleh" },
    ],
    phrases: [
      { id: "fp1", text: "Bonjour! Comment allez-vous?", translation: "Hello! How are you?", speaker: "teacher" },
      { id: "fp2", text: "Merci beaucoup!", translation: "Thank you very much!", speaker: "student" },
    ],
    activities: [
      {
        id: "fa1",
        type: "multiple-choice",
        prompt: "How do you say 'Thank you' in French?",
        options: ["Merci", "Bonjour", "Au revoir", "Pardon"],
        correctAnswer: "Merci",
      },
    ],
  },
  {
    id: "fr-1-2",
    unitId: "fr-unit-1",
    languageId: "french",
    title: "AI Teacher: Meeting Jean-Luc",
    description: "Practice your French pronunciation with your AI tutor Jean-Luc!",
    type: "video-teacher",
    xp: 30,
    durationMinutes: 5,
    order: 2,
    aiTeacherPrompt:
      "You are Jean-Luc, a polite and encouraging AI French teacher from Paris. Greet the student with 'Bonjour! Comment vous appelez-vous?'. Help them practice introducing themselves in French using 'Je m'appelle...' and polite phrases like 'Enchanté' and 'Merci'. Provide clear, constructive feedback on their pronunciation.",
    goals: [
      { id: "fg3", description: "Practice spoken French with AI Teacher Jean-Luc", xpReward: 15 },
      { id: "fg4", description: "Master 'Je m'appelle' and 'Enchant\u00e9'", xpReward: 15 },
    ],
    vocabulary: [
      { id: "fv5", word: "Je m'appelle", translation: "My name is", phonetic: "zhuh mah-pell" },
      { id: "fv6", word: "Enchant\u00e9", translation: "Delighted / Nice to meet you", phonetic: "ahn-shahn-tay" },
    ],
    phrases: [
      { id: "fp3", text: "Bonjour! Je m'appelle Jean-Luc.", translation: "Hello! My name is Jean-Luc.", speaker: "teacher" },
    ],
    activities: [
      {
        id: "fa2",
        type: "video-teacher",
        prompt: "Connect with Jean-Luc for your interactive French voice session.",
        aiTeacherPrompt: "You are Jean-Luc, a friendly AI French teacher from Paris.",
      },
    ],
  },

  // --- GERMAN LESSONS ---
  {
    id: "de-1-1",
    unitId: "de-unit-1",
    languageId: "german",
    title: "Hallo & Guten Tag",
    description: "Learn German greetings like Hallo, Guten Tag, and Tsch\u00fcss.",
    type: "standard",
    xp: 15,
    durationMinutes: 3,
    order: 1,
    goals: [
      { id: "dg1", description: "Learn 4 key German greetings", xpReward: 5 },
      { id: "dg2", description: "Complete matching and translation exercises", xpReward: 10 },
    ],
    vocabulary: [
      { id: "dv1", word: "Hallo", translation: "Hello", phonetic: "hah-loh" },
      { id: "dv2", word: "Guten Tag", translation: "Good day / Hello", phonetic: "goo-ten tahk" },
      { id: "dv3", word: "Danke", translation: "Thank you", phonetic: "dahn-keh" },
      { id: "dv4", word: "Tsch\u00fcss", translation: "Bye", phonetic: "tchooss" },
    ],
    phrases: [
      { id: "dp1", text: "Hallo! Wie geht's?", translation: "Hello! How are you?", speaker: "teacher" },
      { id: "dp2", text: "Danke, gut!", translation: "Thanks, good!", speaker: "student" },
    ],
    activities: [
      {
        id: "da1",
        type: "multiple-choice",
        prompt: "What does 'Guten Tag' mean?",
        options: ["Good day / Hello", "Goodbye", "Please", "Thank you"],
        correctAnswer: "Good day / Hello",
      },
    ],
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
    goals: [
      { id: "jg1", description: "Learn basic Japanese greetings", xpReward: 5 },
      { id: "jg2", description: "Practice Konnichiwa & Arigatou", xpReward: 10 },
    ],
    vocabulary: [
      { id: "jv1", word: "\u3053\u3093\u306b\u3061\u306f (Konnichiwa)", translation: "Hello / Good afternoon", phonetic: "kohn-nee-chee-wah" },
      { id: "jv2", word: "\u3042\u308a\u304c\u3068\u3046 (Arigatou)", translation: "Thank you", phonetic: "ah-ree-gah-toh" },
      { id: "jv3", word: "\u3055\u3088\u3046\u306a\u3089 (Sayounara)", translation: "Goodbye", phonetic: "sah-yoh-nah-rah" },
    ],
    phrases: [
      { id: "jp1", text: "\u3053\u3093\u306b\u3061\u306f\uff01\u306f\u3058\u3081\u307e\u3057\u3066\u3002", translation: "Hello! Nice to meet you.", speaker: "teacher" },
    ],
    activities: [
      {
        id: "ja1",
        type: "multiple-choice",
        prompt: "How do you say 'Thank you' in Japanese?",
        options: ["\u3042\u308a\u304c\u3068\u3046 (Arigatou)", "\u3053\u3093\u306b\u3061\u306f (Konnichiwa)", "\u3055\u3088\u3046\u306a\u3089 (Sayounara)"],
        correctAnswer: "\u3042\u308a\u304c\u3068\u3046 (Arigatou)",
      },
    ],
  },

  // --- ITALIAN LESSONS ---
  {
    id: "it-1-1",
    unitId: "it-unit-1",
    languageId: "italian",
    title: "Ciao & Caffe",
    description: "Learn Italian greetings and how to order an espresso.",
    type: "standard",
    xp: 15,
    durationMinutes: 3,
    order: 1,
    goals: [
      { id: "ig1", description: "Master Italian greetings Ciao & Buongiorno", xpReward: 5 },
      { id: "ig2", description: "Order an espresso like a local", xpReward: 10 },
    ],
    vocabulary: [
      { id: "iv1", word: "Ciao", translation: "Hello / Bye", phonetic: "chow" },
      { id: "iv2", word: "Buongiorno", translation: "Good morning / Hello", phonetic: "bwohn-johr-noh" },
      { id: "iv3", word: "Un caf\u00e8", translation: "An espresso coffee", phonetic: "oon kah-feh" },
      { id: "iv4", word: "Grazie", translation: "Thank you", phonetic: "grah-tsee-eh" },
    ],
    phrases: [
      { id: "ip1", text: "Ciao! Un caf\u00e8, per favore.", translation: "Hello! A coffee, please.", speaker: "student" },
    ],
    activities: [
      {
        id: "ia1",
        type: "multiple-choice",
        prompt: "What does 'Grazie' mean in Italian?",
        options: ["Thank you", "Hello", "Coffee", "Goodbye"],
        correctAnswer: "Thank you",
      },
    ],
  },
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
