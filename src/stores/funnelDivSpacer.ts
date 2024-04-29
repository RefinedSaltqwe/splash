import { create } from "zustand";

type DivSpacerStore = {
  isShow: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useDivSpacer = create<DivSpacerStore>((set) => ({
  isShow: false,
  onOpen: () => set({ isShow: true }),
  onClose: () => set({ isShow: false }),
}));
