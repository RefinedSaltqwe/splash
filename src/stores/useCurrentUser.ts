import { create } from "zustand";

type CurrentUserStore = {
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
  id?: string | null | undefined;
  setUser: (
    id: string | null | undefined,
    name: string | null | undefined,
    image: string | null | undefined,
    email: string | null | undefined,
  ) => void;
};

export const useCurrentUserStore = create<CurrentUserStore>((set) => ({
  name: "",
  email: "",
  image: "",
  id: "",
  setUser: (
    id: string | null | undefined,
    name?: string | null | undefined,
    image?: string | null | undefined,
    email?: string | null | undefined,
  ) => set({ name, id, image, email }),
}));
