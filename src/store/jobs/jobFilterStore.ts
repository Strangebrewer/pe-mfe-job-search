import { create } from 'zustand';

type JobFilters = {
  company: string;
  recruiter: string;
  status: string;
  workFrom: string;
  dateMin: string;
  dateMax: string;
  archived: boolean;
  includeDeclined: boolean;
  sortBy: string;
  sortDir: string;
};

const defaultFilters: JobFilters = {
  company: '',
  recruiter: '',
  status: '',
  workFrom: '',
  dateMin: '',
  dateMax: '',
  archived: false,
  includeDeclined: false,
  sortBy: '',
  sortDir: '',
};

type JobFilterStore = JobFilters & {
  setFilter: (key: keyof JobFilters, value: any) => void;
  setFilters: (filters: Partial<JobFilters>) => void;
  resetFilters: () => void;
};

export const useJobFilterStore = create<JobFilterStore>((set) => ({
  ...defaultFilters,
  setFilter: (key, value) => set({ [key]: value }),
  setFilters: (filters) => set(filters),
  resetFilters: () => set(defaultFilters),
}));