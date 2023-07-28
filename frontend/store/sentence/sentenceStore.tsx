/* eslint-disable react-hooks/rules-of-hooks */
import { nanoid } from "nanoid";
import { create } from "zustand";
import { EncodedJsonWithId, ISentenceStore } from "./types";

export const useSentenceStore = create<ISentenceStore>((set, get) => ({
  raw_string: "",
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
        raw_string: sentence?.raw_string ?? "",
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
  setSource: raw_string => set(() => ({ raw_string })),
  reset: () => set(() => ({ encoded_json: [] })),
}));
