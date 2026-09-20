export type LanguageLevel = "Beginner" | "Intermediate" | "Advanced";

export interface Language {
  id: string;
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  description: string;
  level: LanguageLevel;
  accentColor: string;
  popular?: boolean;
  learnersCount?: string;
  totalUnits: number;
  totalLessons: number;
}

export interface Unit {
  id: string;
  languageId: string;
  unitNumber: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  totalLessons: number;
}

export type LessonType = "standard" | "audio" | "ai-tutor" | "video-teacher";

export type ActivityType =
  | "multiple-choice"
  | "fill-in-the-blank"
  | "matching"
  | "audio-lesson"
  | "ai-tutor-chat"
  | "video-teacher";

export interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  phonetic?: string;
  partOfSpeech?: "noun" | "verb" | "adjective" | "adverb" | "phrase";
  exampleSentence?: string;
  exampleTranslation?: string;
  audioUrl?: string;
  imageUrl?: string;
}

export interface Phrase {
  id: string;
  text: string;
  translation: string;
  phonetic?: string;
  speaker?: "teacher" | "student";
  audioUrl?: string;
}

export interface MatchingPair {
  id: string;
  left: string;
  right: string;
}

export interface Activity {
  id: string;
  type: ActivityType;
  prompt: string;
  explanation?: string;
  options?: string[];
  correctAnswer?: string | number | string[];
  matchingPairs?: MatchingPair[];
  audioUrl?: string;
  vocabulary?: VocabularyItem[];
  phrases?: Phrase[];
  aiTeacherPrompt?: string;
}

export interface LessonGoal {
  id: string;
  description: string;
  xpReward: number;
}

export interface Lesson {
  id: string;
  unitId: string;
  languageId: string;
  title: string;
  description: string;
  type: LessonType;
  xp: number;
  durationMinutes: number;
  order: number;
  goals: LessonGoal[];
  activities: Activity[];
  vocabulary: VocabularyItem[];
  phrases: Phrase[];
  aiTeacherPrompt?: string;
}
