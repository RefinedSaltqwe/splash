import { create } from "zustand";

type CustomerModalStore = {
  modalId?: string;
  name: string;
  isOpen: boolean;
  onOpen: (id: string, name: string) => void;
  onClose: () => void;
};

export const useDeleteCustomerModal = create<CustomerModalStore>((set) => ({
  modalId: undefined,
  name: "",
  isOpen: false,
  onOpen: (id: string, name: string) =>
    set({ isOpen: true, modalId: id, name }),
  onClose: () => set({ isOpen: false, modalId: undefined, name: "" }),
}));
