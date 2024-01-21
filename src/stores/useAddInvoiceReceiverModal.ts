import { create } from "zustand";

type AddInvoiceReceiverStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useAddInvoiceReceiverModal = create<AddInvoiceReceiverStore>(
  (set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
  }),
);
