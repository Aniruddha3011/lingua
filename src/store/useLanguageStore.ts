import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { getLanguageById } from "@/data/languages";
import { Language } from "@/types/learning";

interface LanguageState {
  selectedLanguageId: string | null;
  hasHydrated: boolean;
  completedLessonIds: string[];
  xp: number;
  streak: number;
  setSelectedLanguageId: (id: string | null) => void;
  clearSelectedLanguage: () => Promise<void>;
  getSelectedLanguage: () => Language | undefined;
  setHasHydrated: (state: boolean) => void;
  markLessonCompleted: (lessonId: string, earnedXp?: number) => void;
  addXp: (amount: number) => void;
  incrementStreak: () => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      selectedLanguageId: null,
      hasHydrated: false,
      completedLessonIds: [],
      xp: 25,
      streak: 12,
      setSelectedLanguageId: (id: string | null) => {
        set({ selectedLanguageId: id });
      },
      clearSelectedLanguage: async () => {
        set({ selectedLanguageId: null, completedLessonIds: [], xp: 0 });
        try {
          await AsyncStorage.removeItem("dualingo-language-storage");
        } catch {
          // Silent catch
        }
      },
      getSelectedLanguage: () => {
        const id = get().selectedLanguageId;
        return id ? getLanguageById(id) : undefined;
      },
      setHasHydrated: (state: boolean) => {
        set({ hasHydrated: state });
      },
      markLessonCompleted: (lessonId: string, earnedXp = 15) => {
        set((state) => {
          const currentList = Array.isArray(state.completedLessonIds)
            ? state.completedLessonIds
            : [];
          return {
            completedLessonIds: currentList.includes(lessonId)
              ? currentList
              : [...currentList, lessonId],
            xp: (typeof state.xp === "number" ? state.xp : 25) + earnedXp,
          };
        });
      },
      addXp: (amount: number) => {
        set((state) => ({
          xp: (typeof state.xp === "number" ? state.xp : 25) + amount,
        }));
      },
      incrementStreak: () => {
        set((state) => ({
          streak: (typeof state.streak === "number" ? state.streak : 12) + 1,
        }));
      },
    }),
    {
      name: "dualingo-language-storage",
      storage: createJSONStorage(() => AsyncStorage),
      merge: (persistedState: any, currentState) => ({
        ...currentState,
        ...persistedState,
        completedLessonIds: Array.isArray(persistedState?.completedLessonIds)
          ? persistedState.completedLessonIds
          : [],
        xp: typeof persistedState?.xp === "number" ? persistedState.xp : 25,
        streak: typeof persistedState?.streak === "number" ? persistedState.streak : 12,
      }),
      onRehydrateStorage: () => () => {
        useLanguageStore.getState().setHasHydrated(true);
      },
    }
  )
);
