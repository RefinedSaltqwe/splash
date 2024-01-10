import { create } from "zustand";

type ThemeMode = {
  mode: "system" | "dark" | "light";
  setLight: () => void;
  setDark: () => void;
  setSystem: () => void;
};

export const useThemeMode = create<ThemeMode>((set) => ({
  mode: "light",
  setLight: () => set({ mode: "light" }),
  setDark: () => set({ mode: "dark" }),
  setSystem: () => set({ mode: "system" }),
}));
