import { create } from "zustand";

type CustomerModalStore = {
  modalIds?: string[];
  proceed: boolean;
  isOpen: boolean;
  onOpen: (ids: string[]) => void;
  onIsProceed: (is: boolean) => void;
  onClose: () => void;
};

export const useDeleteInvoiceModal = create<CustomerModalStore>((set) => ({
  modalId: [],
  proceed: false,
  isOpen: false,
  onOpen: (ids: string[]) => set({ isOpen: true, modalIds: ids }),
  onIsProceed: (is: boolean) => set({ proceed: is }),
  onClose: () => set({ isOpen: false, modalIds: [], proceed: false }),
}));
