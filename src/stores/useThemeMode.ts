import { create } from "zustand";

type ThemeMode = {
  mode: string;
  setMode: (mode: string) => void;
};

export const useThemeMode = create<ThemeMode>((set) => ({
  mode: "light",
  setMode: (mode: string) => set({ mode }),
}));
