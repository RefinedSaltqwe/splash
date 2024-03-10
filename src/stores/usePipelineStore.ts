import { type Pipeline } from "@prisma/client";
import { create } from "zustand";

type PipelineStore = {
  currentPipelines: Pipeline[] | [];
  setPipelines: (pipeline: Pipeline[] | []) => void;
};

export const usePipelineStore = create<PipelineStore>((set) => ({
  currentPipelines: [],
  setPipelines: (pipeline: Pipeline[] | []) =>
    set({ currentPipelines: pipeline }),
}));
