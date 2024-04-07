import { create } from "zustand";

type CustomerModalStore = {
  modalIds?: string[];
  type:
    | "supplier"
    | "invoice"
    | "customer"
    | "service"
    | "serviceType"
    | "timesheet"
    | "inventory"
    | "none";
  proceed: boolean;
  isOpen: boolean;
  onOpen: (
    ids: string[],
    type:
      | "supplier"
      | "invoice"
      | "customer"
      | "service"
      | "serviceType"
      | "timesheet"
      | "inventory"
      | "none",
  ) => void;
  onIsProceed: (is: boolean) => void;
  onClose: () => void;
};

export const useDeleteManyModal = create<CustomerModalStore>((set) => ({
  modalId: [],
  type: "none",
  proceed: false,
  isOpen: false,
  onOpen: (
    ids: string[],
    type:
      | "supplier"
      | "invoice"
      | "customer"
      | "service"
      | "serviceType"
      | "timesheet"
      | "inventory"
      | "none",
  ) => set({ isOpen: true, modalIds: ids, type }),
  onIsProceed: (is: boolean) => set({ proceed: is }),
  onClose: () =>
    set({ isOpen: false, modalIds: [], proceed: false, type: "none" }),
}));
