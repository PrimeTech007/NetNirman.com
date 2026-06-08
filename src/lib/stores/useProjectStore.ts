import { create } from "zustand";

interface ProjectFilters {
  status: string;
  search: string;
}

interface ProjectState {
  filters: ProjectFilters;
  viewMode: "list" | "kanban";
  setFilter: <K extends keyof ProjectFilters>(key: K, value: ProjectFilters[K]) => void;
  setViewMode: (mode: "list" | "kanban") => void;
  resetFilters: () => void;
}

const defaultFilters: ProjectFilters = {
  status: "",
  search: "",
};

export const useProjectStore = create<ProjectState>((set) => ({
  filters: { ...defaultFilters },
  viewMode: "list",
  setFilter: (key, value) =>
    set((s) => ({ filters: { ...s.filters, [key]: value } })),
  setViewMode: (mode) => set({ viewMode: mode }),
  resetFilters: () => set({ filters: { ...defaultFilters } }),
}));
