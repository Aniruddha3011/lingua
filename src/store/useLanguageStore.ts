import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { getLanguageById } from "@/data/languages";
import { Language } from "@/types/learning";

interface LanguageState {
  selectedLanguageId: string | null;
  hasHydrated: boolean;
  setSelectedLanguageId: (id: string | null) => void;
  clearSelectedLanguage: () => Promise<void>;
  getSelectedLanguage: () => Language | undefined;
  setHasHydrated: (state: boolean) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      selectedLanguageId: null,
      hasHydrated: false,
      setSelectedLanguageId: (id: string | null) => {
        set({ selectedLanguageId: id });
      },
      clearSelectedLanguage: async () => {
        set({ selectedLanguageId: null });
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
    }),
    {
      name: "dualingo-language-storage",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
