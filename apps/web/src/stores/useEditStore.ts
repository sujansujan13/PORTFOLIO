import type { ProjectFormValues } from "@/schemas/project";
import { create, useStore } from "zustand";
import { devtools } from "zustand/middleware";

interface editProps {
  project: ProjectFormValues | null;
  initialize: (project: ProjectFormValues) => void;
}

export const useEditStore = create<editProps, [["zustand/devtools", never]]>(
  devtools((set) => ({
    project: null,
    initialize: () =>
      set((state) => ({
        project: state.project
          ? {
              ...state.project,
            }
          : null,
      })),
  })),
);
