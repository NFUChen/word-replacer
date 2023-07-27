import { SWRResponse } from "swr";
import { SWRMutationResponse } from "swr/mutation";

export type SuggesstionType = "warning" | "regular";

export type RawEncodedJson = { type: SuggesstionType; content: string, replacements: string[] };

export type EncodedJsonWithId = { type: SuggesstionType; content: string; id: WordId, replacements: string[] };

export type Source = string;

export type WordId = string;

export type Sentence = {
  source: Source;
  encoded_json: RawEncodedJson[];
};

export type getEncodedJsonRequest = {
  source: string;
}

export interface ISentenceStore {
  source: Source;
  encoded_json: EncodedJsonWithId[];
  currentWord?: EncodedJsonWithId;
  setSentence(sentence?: Sentence): void;
  setEncodedJsonById(modifiedJson: EncodedJsonWithId): void;
  setCurrentWord(word: EncodedJsonWithId): void;
  setEncodedJson(json: EncodedJsonWithId[]): void;
  setSource(source: string): void;
  reset(): void;
}