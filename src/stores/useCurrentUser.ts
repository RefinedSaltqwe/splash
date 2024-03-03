import { create } from "zustand";

type CurrentUserStore = {
  id?: string | null | undefined;
  agencyId?: string | null | undefined;
  name?: string | null | undefined;
  image?: string | null | undefined;
  email?: string | null | undefined;
  role: string | null | undefined;
  subaccountId?: string | null | undefined;
  setUser: (
    id: string | null | undefined,
    agencyId: string | null | undefined,
    name: string | null | undefined,
    image: string | null | undefined,
    email: string | null | undefined,
    role: string | null | undefined,
    subaccountId: string | null | undefined,
  ) => void;
};

export const useCurrentUserStore = create<CurrentUserStore>((set) => ({
  id: "",
  agencyId: "",
  name: "",
  image: "",
  email: "",
  role: "",
  subaccountId: "",
  setUser: (
    id: string | null | undefined,
    agencyId: string | null | undefined,
    name?: string | null | undefined,
    image?: string | null | undefined,
    email?: string | null | undefined,
    role?: string | null | undefined,
    subaccountId?: string | null | undefined,
  ) => set({ id, agencyId, name, image, email, role, subaccountId }),
}));
