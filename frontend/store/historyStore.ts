import { create } from "zustand";

interface IHistoryStore {
  history: Array<any>;
  position: number;
  getElement(): any;
  init(value: any): void;
  setElement(value: any): void;
  undo(): void;
  redo(): void;
  reset(): void;
}

export const useHistoryStore = create<IHistoryStore>((set, get) => ({
  history: [],
  position: 0,

  getElement() {
    return get().history[get().position];
  },

  init(value: any) {
    set(state => {
      if (state.history.length === 0) {
        state.history = [...state.history, value];
      }
      return { ...state };
    });
  },

  setElement(value: any) {
    set(state => {
      if (state.position < state.history.length - 1) {
        state.history = state.history.slice(0, state.position + 1);
      }
      state.history = [...state.history, value];
      state.position++;

      return { ...state };
    });
  },

  undo() {
    set(state => {
      if (state.position > 0) {
        state.position--;
      }
      return { position: state.position };
    });
  },

  redo() {
    set(state => {
      if (state.position < state.history.length - 1) {
        state.position++;
      }
      return { position: state.position };
    });
  },

  reset() {
    set(() => ({
      position: 0,
      history: [],
    }));
  },
}));
