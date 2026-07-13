import { create } from "zustand";

interface ProjectFormData {
  id?: string;
  title: string;
  subtitle: string;
  category: string;
  techStack: string[];
  imageUrl: string;
  publiclyListed?: boolean;
}

interface DashboardUIState {
  searchQuery: string;
  isProjectModalOpen: boolean;
  editingProject: ProjectFormData | null;
  setSearchQuery: (query: string) => void;
  openNewProjectModal: () => void;
  openEditProjectModal: (project: ProjectFormData) => void;
  closeProjectModal: () => void;
}

export const useDashboardStore = create<DashboardUIState>((set) => ({
  searchQuery: "",
  isProjectModalOpen: false,
  editingProject: null,
  setSearchQuery: (query) => set({ searchQuery: query }),
  openNewProjectModal: () =>
    set({ isProjectModalOpen: true, editingProject: null }),
  openEditProjectModal: (project) =>
    set({ isProjectModalOpen: true, editingProject: project }),
  closeProjectModal: () =>
    set({ isProjectModalOpen: false, editingProject: null }),
}));
