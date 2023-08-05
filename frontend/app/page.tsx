"use client";

import "@/app/scrollbar.css";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { EditArea } from "../components/pages/home/EditArea";
import { useSentenceStore } from "@/store/sentence/sentenceStore";
import { MouseEvent, useCallback, useEffect, useMemo, useState } from "react";
import { EncodedJsonWithId, Sentence, getEncodedJsonRequest } from "@/store/sentence/types";
import { useMutation } from "@/hooks/useMutation";
import { Clipboard, ClipboardCheck, Maximize2, Minimize2, Redo2, RotateCcw, SpellCheck, Undo2 } from "lucide-react";
import { useHistoryStore } from "@/store/historyStore";
import { shallow } from "zustand/shallow";
import { useClipboard } from "@/hooks/useClipboard";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isMaxSize, setIsMaxSize] = useState(false);
  const encodedJson = useSentenceStore(state => state.encoded_json);
  const rawString = useSentenceStore(state => state.raw_string);
  const { copy, copied } = useClipboard();
  const router = useRouter();
  const [init, undo, redo, history, position, getElement] = useHistoryStore(
    state => [state.init, state.undo, state.redo, state.history, state.position, state.getElement],
    shallow,
  );

  const { trigger: encode, isMutating, data } = useMutation<getEncodedJsonRequest, Sentence>("post", "/encode");

  const isEncoded = useMemo((): boolean => encodedJson.length !== 0, [encodedJson]);
  const isEmpty = useMemo((): boolean => rawString.length === 0, [rawString]);
  const cardClass = isMaxSize ? "max-w-full max-h-full" : "max-w-[800px] max-h-[400px] sm:max-h-[600px]";

  const toggleResize = () => {
    setIsMaxSize(state => !state);
  };

  const updateContent = () => {
    const sentenceString = getElement().reduce((a: any, b: EncodedJsonWithId) => a.concat(b.content), "");
    useSentenceStore.getState().setEncodedJson(getElement());
    useSentenceStore.getState().setRawString(sentenceString);
  };

  const handleTrigger = useCallback(
    (e: MouseEvent) => {
      encode({ source: rawString });
    },
    [encode, rawString],
  );

  const handleCopy = () => {
    copy(rawString);
  };

  const handleUndo = () => {
    if (position === 0) {
      return;
    }
    undo();
    updateContent();
  };

  const handleRedo = () => {
    if (position > history.length - 1) {
      return;
    }
    redo();
    updateContent();
  };

  const handleReset = () => {
    useSentenceStore.getState().reset();
    useHistoryStore.getState().reset();
  };

  useEffect(() => {
    if (data !== undefined) {
      useSentenceStore.getState().setSentence(data?.data);
    }
    if (useSentenceStore.getState().encoded_json.length !== 0) {
      init(JSON.parse(JSON.stringify(useSentenceStore.getState().encoded_json)));
    }
  }, [data, init]);

  useEffect(() => {
    router.prefetch("/word-add");
    handleReset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative flex h-screen-header flex-col p-4">
      <div className="flex h-full items-center justify-center overflow-hidden">
        <Card className={`${cardClass} flex h-full w-full flex-col transition-[max-height,max-width] ease-in-out`}>
          {/* header */}
          <CardHeader className="py-4">
            <div className="flex items-center justify-between text-lg font-bold">
              <span>文案校正</span>
              <Button onClick={toggleResize} className="h-auto text-primary" variant="ghost">
                {isMaxSize ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </Button>
            </div>
          </CardHeader>

          <Separator className="h-[.5px]" />

          {/* content */}
          <div className="flex-auto overflow-hidden">
            <EditArea isMutating={isMutating} />
          </div>

          <Separator className="h-[.5px]" />

          {/* footer */}
          <CardFooter className="flex items-center px-4 pb-4 pt-2">
            {encodedJson.length ? (
              <div>
                <Button disabled={position <= 0} onClick={handleUndo} className="rounded-r-none" variant="outline">
                  <Undo2 size={16} />
                </Button>
                <Button
                  disabled={position >= history.length - 1}
                  onClick={handleRedo}
                  className="rounded-l-none border-l-0"
                  variant="outline"
                >
                  <Redo2 size={16} />
                </Button>
              </div>
            ) : null}
            {isEncoded ? (
              <div className="ml-4 flex flex-auto justify-between">
                <Button onClick={handleReset} variant="outline">
                  <RotateCcw size={16} />
                  <span className="ml-2">編輯</span>
                </Button>
                <Button disabled={copied} onClick={handleCopy} variant="outline">
                  {copied ? (
                    <ClipboardCheck className="fade-out" size={16} />
                  ) : (
                    <Clipboard className="fade-out" size={16} />
                  )}
                  <span className="ml-2">複製</span>
                </Button>
              </div>
            ) : (
              <Button onClick={handleTrigger} className="ml-auto" disabled={isEmpty}>
                <SpellCheck size={16} />
                <span className="ml-2">校正</span>
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
