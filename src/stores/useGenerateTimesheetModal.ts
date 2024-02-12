import { create } from "zustand";

type GenerateTimesheetModalStore = {
  title: string;
  description: string;
  drawerId: string;
  drawerName: string;
  isOpen: boolean;
  onUpdate: (id: string, name: string) => void;
  onCreate: () => void;
  onClose: () => void;
};

export const useGenerateTimesheetModal = create<GenerateTimesheetModalStore>(
  (set) => ({
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
        title: "Generate Timesheet",
        description: "Create timesheet for next week.",
      }),
    onClose: () => set({ isOpen: false, drawerId: "", drawerName: "" }),
  }),
);
