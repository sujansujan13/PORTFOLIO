import { create } from "zustand";
import { initialProjects } from "@/data/mockprojects-dashboard";
import { p } from "framer-motion/client";
import type { ProjectFormValues } from "@/schemas/project";

interface ProjectStoreState {
  projects: ProjectFormValues[];
  searchQuery: string;
  currentPage: number;
  selectedIds: string[];

  // Actions
  setSearchQuery: (query: string) => void;
  toggleSelectRow: (id: string) => void;
  toggleSelectAll: () => void;
  deleteSingleProject: (id: string) => void;
  deleteSelectedProjects: () => void;
  setCurrentPage: (page: number) => void;
}

export const useProjectStore = create<ProjectStoreState>((set) => ({
  projects: initialProjects,
  searchQuery: "",
  currentPage: 1,
  selectedIds: [],

  setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),

  toggleSelectRow: (id) =>
    set((state) => ({
      selectedIds: state.selectedIds.includes(id)
        ? state.selectedIds.filter((item) => item !== id)
        : [...state.selectedIds, id],
    })),

  toggleSelectAll: () =>
    set((state) => {
      const itemsPerPage = 10;
      const startIndex = (state.currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;

      // Slice the searched array to get ONLY the items on the active page
      const searchedProjects = state.projects.filter((p) =>
        p.title.toLowerCase().includes(state.searchQuery.toLowerCase()),
      );
      const currentViewIds = searchedProjects
        .slice(startIndex, endIndex)
        .map((p) => p.id);

      const areAllSelected = currentViewIds.every((id) =>
        state.selectedIds.includes(id),
      );
      return {
        selectedIds: areAllSelected
          ? state.selectedIds.filter((id) => !currentViewIds.includes(id))
          : Array.from(new Set([...state.selectedIds, ...currentViewIds])),
      };
    }),

  deleteSingleProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      selectedIds: state.selectedIds.filter((itemId) => itemId !== id),
    })),

  deleteSelectedProjects: () =>
    set((state) => ({
      projects: state.projects.filter((p) => !state.selectedIds.includes(p.id)),
    })),

  setCurrentPage: (page) =>
    set(() => ({
      currentPage: page,
    })),
}));

// setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 });
// why currentPage: 1 is used
// Resets the pagination to the first page whenever the search query changes.

// Javascript
//
// #every method of array
//
// #Array.from(new Set([...state.selectedIds, ...currentViewIds])),
