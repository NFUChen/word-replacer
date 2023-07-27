"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useHistoryStore } from "@/store/historyStore";
import { usePreferenceStore } from "@/store/preference";
import { useSentenceStore } from "@/store/sentence/sentenceStore";
import { EncodedJsonWithId, SuggesstionType, WordId } from "@/store/sentence/types";
import { ChevronsDownIcon, Wand2 } from "lucide-react";
import { memo, useRef, ChangeEvent, useState } from "react";
import { shallow } from "zustand/shallow";

interface IEditArea {
  isMutating: boolean;
}

export const EditArea: React.FC<IEditArea> = ({ isMutating }) => {
  const encodedJson = useSentenceStore(state => state.encoded_json);
  const [source, setSource] = useSentenceStore(state => [state.source, state.setSource], shallow);
  const contentRef = useRef<HTMLDivElement>(null);

  if (isMutating) {
    return <LoadingSkeleton />;
  }
  return (
    <>
      {encodedJson.length ? (
        <div className="fade-out break-words leading-8 tracking-wide h-full overflow-scroll flex flex-col">
          <div ref={contentRef} className="py-4 text-lg px-6 whitespace-pre-wrap">
            {encodedJson.map(word => (
              <SuggestionCard key={word.id} {...word} />
            ))}
          </div>
        </div>
      ) : (
        <Textarea
          value={source}
          onInput={(e: ChangeEvent<HTMLTextAreaElement>) => setSource(e.target.value)}
          className="fade-out text-lg py-4 px-6 leading-8 tracking-wide resize-none h-full border-0 focus-visible:ring-0 focus-visible:ring-none focus-visible:ring-offset-0 focus-visible:outline-none "
          placeholder="請輸入或貼上文字"
          spellCheck={false}
          autoFocus
        />
      )}
    </>
  );
};

const LoadingSkeleton: React.FC = () => (
  <div className="py-4 px-3 flex flex-col gap-3">
    {Array(10)
      .fill(0)
      .map((_, index) => (
        <Skeleton key={index} className="h-4 w-full rounded-sm" />
      ))}
  </div>
);

interface ISuggestionCard {
  type: SuggesstionType;
  content: string;
  replacements: string[];
  id: WordId;
}

export const SuggestionCard: React.FC<ISuggestionCard> = memo(({ type, content, replacements, id }) => {
  const autoComplete = usePreferenceStore(state => state.autoComplete);
  const setEncodedJsonById = useSentenceStore(state => state.setEncodedJsonById);
  const setCurrentWord = useSentenceStore(state => state.setCurrentWord);
  const setSource = useSentenceStore(state => state.setSource);
  const setElement = useHistoryStore(state => state.setElement);
  const [showAll, setShowAll] = useState(false);

  const triggerChangeAnimation = (replacement: string) => {
    if (autoComplete) {
      const json = useSentenceStore.getState().encoded_json.map(word => {
        if (word.content === content) {
          return {
            ...word,
            type: "regular",
            content: replacement,
          };
        }
        return { ...word };
      }) as EncodedJsonWithId[];
      useSentenceStore.getState().setEncodedJson(json);
    } else {
      setEncodedJsonById({
        type: "regular",
        content: replacement,
        replacements,
        id,
      });
    }

    setElement(JSON.parse(JSON.stringify(useSentenceStore.getState().encoded_json)));
    setSource(useSentenceStore.getState().encoded_json.reduce((a, b) => a.concat(b.content), ""));
  };

  const handleTrigger = () => {
    setCurrentWord({
      content,
      replacements,
      type,
      id,
    });
  };

  return (
    <>
      {type === "regular" ? (
        content
      ) : (
        <Popover>
          <PopoverTrigger
            onClick={handleTrigger}
            className="text-md rounded py-0 data-[change=true]:bg-green-400/40 transition-colors duration-300  data-[state=open]:bg-destructive/40"
          >
            <span
              data-id={id}
              data-type={type}
              className="border-b-2 border-destructive data-[type=regular]:border-none"
            >
              {content}
            </span>
          </PopoverTrigger>
          <PopoverContent align="start" className="p-1">
            <div className="flex items-center py-2 px-4">
              <Wand2 className="text-blue-400 dark:text-blue-600" size={16} />
              {/* <div className="font-bold text-destructive/80 dark:text-destructive">危險用詞</div> */}
              <div className="font-bold text-blue-400 dark:text-blue-600 ml-4">建議替換</div>
            </div>
            <Separator />
            <div className="flex flex-col overflow-auto">
              <div className="flex flex-col py-1 items-center">
                {replacements.map((replacement, index) =>
                  index < 2 || showAll ? (
                    <Button
                      key={replacement}
                      onClick={() => triggerChangeAnimation(replacement)}
                      variant="ghost"
                      className="cursor-pointer w-full justify-start py-4 text-sm whitespace-nowrap"
                    >
                      {replacement}
                    </Button>
                  ) : null,
                )}
              </div>
              {replacements.length > 2 && !showAll ? (
                <>
                  <Separator className="mb-1 h-[.5px]" />
                  <Button
                    onClick={() => {
                      setShowAll(true);
                    }}
                    variant="link"
                    className="flex items-center justify-center font-bold cursor-pointer text-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4 h-4">
                      <path
                        fill="#424242"
                        d="M24,4c-5.5,0-10,4.5-10,10v4h4v-4c0-3.3,2.7-6,6-6s6,2.7,6,6v4h4v-4C34,8.5,29.5,4,24,4z"
                      />
                      <path
                        fill="#FB8C00"
                        d="M36,44H12c-2.2,0-4-1.8-4-4V22c0-2.2,1.8-4,4-4h24c2.2,0,4,1.8,4,4v18C40,42.2,38.2,44,36,44z"
                      />
                      <path fill="#C76E00" d="M24 28A3 3 0 1 0 24 34A3 3 0 1 0 24 28Z" />
                    </svg>
                    <span className="whitespace-nowrap text-xs leading-none ml-2">看更多</span>
                    <ChevronsDownIcon size={16} />
                  </Button>
                </>
              ) : null}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </>
  );
});
