import { create } from "zustand";

interface IPreferenceStore {
  autoComplete: boolean;
  setAutoComplete(value: boolean): void;
}

export const usePreferenceStore = create<IPreferenceStore>((set, get) => ({
  autoComplete: false,
  setAutoComplete(value: boolean) {
    set(() => ({
      autoComplete: value,
    }));
  },
}));
