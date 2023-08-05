"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-separator";
import { ChangeEvent, useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Edit3, GripVertical, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { WordSuggestion } from "./columns";
import { Row, Table } from "@tanstack/react-table";
import { AddWordDialog } from "./AddWordDialog";
import { useMutation } from "@/hooks/useMutation";
import { useSWRConfig } from "swr";
import { debounce } from "@/utils/utils";
import { DragDropContext, Draggable, DropResult, Droppable, ResponderProvided } from "@hello-pangea/dnd";
import { useToast } from "@/components/ui/use-toast";

interface IAddWordPannel {
  isOpen: boolean;
  onClose(): void;
  row?: Row<WordSuggestion>;
  table: Table<WordSuggestion>;
}

type RenameIllegalWordRequest = {
  illegal_word: string;
  new_illegal_word: string;
};

type AddWordRequest = {
  illegal_word: string;
  suggestions: string[];
};

export const AddWordPannel: React.FC<IAddWordPannel> = ({ isOpen, onClose, row, table }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [illegalWord, setIllegalWord] = useState("");
  const [orderedList, setOrderedList] = useState<string[]>([]);
  const [isAddWordDialogOpen, setIsAddWordDialogOpen] = useState(false);
  const isEditMode = useMemo(() => !!row, [row]);
  const isComposition = useRef(false);
  const addWordPannelRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { mutate } = useSWRConfig();

  const { trigger: addWord, isMutating: isAddMutating } = useMutation<AddWordRequest, string>(
    "post",
    "/add_word_with_suggestions",
    {
      onSuccess: data => {
        mutate("/all_words_with_suggesions");
        if (data?.error) return;
        onClose();
      },
    },
  );

  const { trigger: updateSuggestions, isMutating: isUpdateMutating } = useMutation<WordSuggestion, string>(
    "post",
    "/update_suggestions",
    {
      onSuccess: data => {
        mutate("/all_words_with_suggesions");
        if (data?.error) return;
        setIsAddWordDialogOpen(false);
      },
    },
  );

  const { trigger: renameIllegalWord, isMutating: isRenameMutating } = useMutation<RenameIllegalWordRequest, string>(
    "post",
    "/rename_illegal_word",
    {
      onSuccess: () => {
        mutate("/all_words_with_suggesions");
        setIsEditing(false);
      },
      onError: () => {
        setIsEditing(false);
      },
    },
  );

  const className = {
    containerClass: "fixed top-0 backdrop-blur-sm w-screen h-screen bg-background/40 z-[50] flex justify-end",
    sideBarClass:
      "absolute slide-right flex flex-col bg-background border-l-[1px] transition-all duration-300 ease-in-out data-[state=false]:opacity-0 data-[state=false]:translate-x-1/4 shadow-lg w-screen sm:max-w-[640px] h-screen py-8 px-4",
  };

  /**
   * Debounce for updating word name
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onIllegalWordChange = useCallback(
    debounce((illegalWord, newIllegalWord, row) => {
      if (!isComposition.current && !isEditing) {
        renameIllegalWord({ illegal_word: illegalWord, new_illegal_word: newIllegalWord });
      }
    }, 1000),
    [],
  );

  /**
   * Function to update list on drop
   */
  const handleDrop = (droppedItem: DropResult, provided: ResponderProvided) => {
    // Ignore drop outside droppable container
    if (!droppedItem.destination) return;
    var updatedList = [...orderedList];
    // Remove dragged item
    const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
    // Add dropped item
    updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
    // Update State
    setOrderedList(updatedList);
    if (isEditMode) {
      updateSuggestions({
        id: row?.original.id ?? "",
        illegal_word: illegalWord,
        suggestions: updatedList,
      });
    }
  };

  /**
   * Remove suggestion
   */
  const handleRemoveSuggestion = (index: number) => {
    // if is edit mode, it will check orderedList length and call update api
    if (isEditMode) {

      if (orderedList.length <= 1) {
        toast({
          title: "警告",
          variant: "destructive",
          description: "至少需要有一個建議字詞",
        });
        return;
      }
      updateSuggestions({
        id: row?.original.id ?? "",
        illegal_word: illegalWord,
        suggestions: orderedList.filter((value, i) => index !== i),
      });

      return;
    }

    // if not, just set the list
    setOrderedList(state => {
      state.splice(index, 1);
      return [...state];
    });

    
  };

  /**
   * Submit add word, call add word api
   */
  const handleAddWord = () => {
    addWord({ illegal_word: illegalWord, suggestions: orderedList });
  };

  /**
   * Add suggestion word
   */
  const handleAddSuggestion = (suggestion: string) => {
    if (isEditMode) {
      updateSuggestions({
        id: row?.original.id ?? "",
        illegal_word: illegalWord,
        suggestions: [...orderedList, suggestion],
      });
      return;
    }

    if (orderedList.includes(suggestion)) {
      toast({
        title: "警告",
        variant: "destructive",
        description: "建議字詞 " + suggestion + " 已存在",
      });
      return;
    }
    setIsAddWordDialogOpen(false);
    setOrderedList(state => [...state, suggestion]);
  };

  // For slide animation
  const onTransitionEnd = () => {
    if (!isOpen) {
      setIsMounted(false);
    }
  };

  useLayoutEffect(() => {
    if (!isOpen) return;
    setIsMounted(true);
    setIllegalWord(row?.original.illegal_word ?? "");
    setOrderedList([...(row?.original.suggestions ?? [])]);
  }, [isEditMode, isOpen, row]);

  return (
    <>
      {isMounted ? (
        <div onTransitionEnd={onTransitionEnd} className={className.containerClass}>
          <div ref={addWordPannelRef} data-state={isOpen} className={className.sideBarClass}>
            {/* setting title */}
            <div className="mb-8">
              <div className="mb-2 flex items-center justify-center font-bold text-zinc-300">
                危險字詞
                <Edit3 className="ml-2" size={16} />
              </div>
              <Input
                value={illegalWord}
                onCompositionStart={() => (isComposition.current = true)}
                onCompositionEnd={() => (isComposition.current = false)}
                onInput={(e: ChangeEvent<HTMLInputElement>) => {
                  setIllegalWord(e.target.value);
                  if (isEditMode) {
                    setIsEditing(true);
                    onIllegalWordChange(row?.original.illegal_word ?? "", e.target.value, row);
                  }
                }}
                placeholder="請輸入危險字詞"
                className=" focus-visible:ring-none h-12 w-full border-0 bg-transparent px-2 text-center text-2xl font-bold tracking-wider placeholder:text-input focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            {/* setting body */}
            <div className="mb-2 flex items-center justify-between px-2">
              <div className="text-zinc-400">建議字詞</div>
              <AddWordDialog
                onSuggestionAdd={handleAddSuggestion}
                isOpen={isAddWordDialogOpen}
                onOpenChange={setIsAddWordDialogOpen}
              />
            </div>

            <Separator className="mb-4 h-[.5px] bg-primary/10" />

            <div className="mb-4 flex-auto overflow-auto">
              <DragDropContext onDragEnd={handleDrop}>
                <Droppable droppableId="list-container">
                  {provided => (
                    <div
                      className="grid grid-cols-1 gap-2 px-2 pb-4 pt-2"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {orderedList.map((suggestion, index) => (
                        <DraggableItem
                          suggestion={suggestion}
                          index={index}
                          key={suggestion}
                          onRemoveSuggestion={handleRemoveSuggestion}
                        />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>

            {/* close button */}
            {isEditMode ? (
              <Button disabled={isUpdateMutating || isRenameMutating || isEditing} onClick={onClose}>
                {isEditing ? "儲存中..." : "完成"}
              </Button>
            ) : (
              <div className="mt-auto grid grid-cols-2 gap-4">
                <Button onClick={onClose} variant="ghost">
                  取消
                </Button>
                <Button disabled={!illegalWord || orderedList.length === 0 || isAddMutating} onClick={handleAddWord}>
                  {isAddMutating ? <Loader2 className="animate-spin" /> : "儲存"}
                </Button>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
};

interface IDraggableItem {
  suggestion: string;
  index: number;
  onRemoveSuggestion(index: number): void;
}

const DraggableItem: React.FC<IDraggableItem> = ({ suggestion, index, onRemoveSuggestion }) => {
  return (
    <Draggable draggableId={suggestion} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          className="flex items-center gap-2"
          {...provided.dragHandleProps}
          {...provided.draggableProps}
        >
          <div className="text-xs text-input whitespace-nowrap basis-1/12">順序{index}</div>
          <div
            data-state={snapshot.isDragging}
            className="relative flex flex-auto items-center justify-between overflow-hidden rounded-sm border-[1px] border-b py-1 pl-4 pr-2 transition-all hover:scale-[102%] hover:bg-zinc-50 data-[state=true]:ring-2 data-[state=true]:ring-primary data-[state=true]:bg-zinc-50/80 dark:bg-zinc-900 hover:dark:bg-zinc-700/80 data-[state=true]:dark:bg-zinc-700/80"
          >
            <div>
              <GripVertical className="cursor-pointer" />
            </div>
            <div className="overflow-hidden text-center text-ellipsis">{suggestion}</div>
            <Button
              onClick={() => {
                onRemoveSuggestion(index);
              }}
              variant="ghost"
              size="icon"
            >
              <X size={16} />
            </Button>
          </div>
        </div>
      )}
    </Draggable>
  );
};
