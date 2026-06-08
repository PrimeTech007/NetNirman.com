import { create } from "zustand";

interface InquiryFilters {
  status: string;
  projectType: string;
  budgetRange: string;
  search: string;
  page: number;
}

interface InquiryState {
  filters: InquiryFilters;
  setFilter: <K extends keyof InquiryFilters>(key: K, value: InquiryFilters[K]) => void;
  resetFilters: () => void;
}

const defaultFilters: InquiryFilters = {
  status: "",
  projectType: "",
  budgetRange: "",
  search: "",
  page: 1,
};

export const useInquiryStore = create<InquiryState>((set) => ({
  filters: { ...defaultFilters },
  setFilter: (key, value) =>
    set((s) => ({ filters: { ...s.filters, [key]: value, page: key === "page" ? (value as number) : 1 } })),
  resetFilters: () => set({ filters: { ...defaultFilters } }),
}));
