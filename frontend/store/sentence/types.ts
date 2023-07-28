export type SuggesstionType = "warning" | "regular";

export type RawEncodedJson = { type: SuggesstionType; content: string, replacements: string[] };

export type EncodedJsonWithId = { type: SuggesstionType; content: string; id: WordId, replacements: string[] };

export type WordId = string;

export type Sentence = {
  raw_string: string;
  encoded_json: RawEncodedJson[];
};

export type getEncodedJsonRequest = {
  source: string;
}

export interface ISentenceStore {
  raw_string: string;
  encoded_json: EncodedJsonWithId[];
  currentWord?: EncodedJsonWithId;
  setSentence(sentence?: Sentence): void;
  setEncodedJsonById(modifiedJson: EncodedJsonWithId): void;
  setCurrentWord(word: EncodedJsonWithId): void;
  setEncodedJson(json: EncodedJsonWithId[]): void;
  setSource(raw_string: string): void;
  reset(): void;
}