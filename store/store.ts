import { create } from "zustand";

interface UserStore {
  email: string | null;
  name: string | null;
  avatar: string | null;
  setValues: (values: Partial<Omit<UserStore, "setValues">>) => void;
}

type TranslationLang = "english" | "marathi" | "hindi";

interface LangStore {
  lang: TranslationLang;
  setLang: (lang: TranslationLang) => void;
}

// Load persisted state from localStorage
const getInitialState = (): UserStore => {
  if (typeof window !== "undefined") {
    const storedData = localStorage.getItem("userStore");
    return storedData
      ? { ...JSON.parse(storedData), setValues: () => {} }
      : { email: null, name: null, avatar: null, setValues: () => {} };
  }
  return { email: null, name: null, avatar: null, setValues: () => {} };
};

export const useUserStore = create<UserStore>((set) => ({
  ...getInitialState(),
  setValues: (values) =>
    set((state) => {
      const newState = { ...state, ...values };
      localStorage.setItem("userStore", JSON.stringify(newState)); // Persist data
      return newState;
    }),
}));

// Function to get initial language state
const getInitialLangState = (): LangStore => {
  if (typeof window !== "undefined") {
    const storedData = localStorage.getItem("langStore");
    return storedData
      ? { lang: JSON.parse(storedData).lang, setLang: () => {} }
      : { lang: "english", setLang: () => {} };
  }
  return { lang: "english", setLang: () => {} };
};

export const useLangStore = create<LangStore>((set) => ({
  ...getInitialLangState(),
  setLang: (lang) =>
    set(() => {
      console.log(lang)
      localStorage.setItem("langStore", JSON.stringify({ lang }));
      return { lang };
    }),
}));
