/* eslint-disable react-hooks/rules-of-hooks */
import { nanoid } from "nanoid";
import { create } from "zustand";
import { EncodedJsonWithId, ISentenceStore, Sentence, getEncodedJsonRequest } from "./types";

export const useSentenceStore = create<ISentenceStore>((set, get) => ({
  source: "",
  encoded_json: [],
  currentWord: undefined,
  setSentence: sentence => {
    set(() => {
      const encodedJsonWithId = sentence?.encoded_json.map<EncodedJsonWithId>((sentence, i) => ({
        id: nanoid(6),
        type: sentence.type,
        content: sentence.content,
        replacements: sentence.replacements,
      }));
      return {
        encoded_json: encodedJsonWithId ?? [],
        source: sentence?.source ?? "",
      };
    });
  },
  setEncodedJsonById: (modifiedJson: EncodedJsonWithId) => {
    set(state => {
      const { id, content, type } = modifiedJson;

      const newJson = state.encoded_json.map(sentence => {
        if (sentence.id === id) {
          sentence.content = content;
          sentence.type = type;
        }
        return sentence;
      });

      return {
        ...state,
        encoded_json: newJson,
      };
    });
  },
  setEncodedJson: (json: EncodedJsonWithId[]) => {
    set(() => ({
      encoded_json: JSON.parse(JSON.stringify(json)),
    }));
  },
  setCurrentWord: word => set(() => ({ currentWord: word })),
  setSource: source => set(() => ({ source })),
  reset: () => set(() => ({ encoded_json: [] })),
}));
