import { create } from "zustand";

type ServiceModalStore = {
  title: string;
  description: string;
  drawerId: string;
  drawerName: string;
  isOpen: boolean;
  onUpdate: (id: string, name: string) => void;
  onCreate: () => void;
  onClose: () => void;
};

export const useServiceModal = create<ServiceModalStore>((set) => ({
  title: "",
  description: "",
  drawerId: "",
  drawerName: "",
  isOpen: false,
  onUpdate: (id: string, name: string) =>
    set({
      isOpen: true,
      drawerId: id,
      drawerName: name,
      title: "Update",
      description: "Make changes to services here.",
    }),
  onCreate: () =>
    set({
      isOpen: true,
      title: "Create",
      description: "Add new service here.",
    }),
  onClose: () => set({ isOpen: false, drawerId: "", drawerName: "" }),
}));
