"use client";

import { DataTable } from "@/components/core/DataTable";
import { Container, LayoutGrid, Loader2, Plus, Search, Table } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MouseEvent, useMemo, useState } from "react";
import { cn, debounce } from "@/utils/utils";
import { useFetch } from "@/hooks/useFetch";
import { Separator } from "@/components/ui/separator";
import { getCoreRowModel, getFilteredRowModel, useReactTable } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { useMutation } from "@/hooks/useMutation";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { AddWordPannel } from "@/components/pages/word-add/AddWordPanel";
import { DataGrid } from "@/components/pages/word-add/DataGrid";
import { DeleteConfirmDialog } from "@/components/pages/word-add/DeleteConfirmDialog";
import { WordSuggestion, wordAddcolumns } from "@/components/pages/word-add/columns";

type RemoveIllegalWordRequest = {
  illegal_words: string[];
};

export default function WordAdd() {
  const [isTableMode, setIsTableMode] = useLocalStorage<boolean>("tableMode", true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [currentRowId, setCurrentRowId] = useState<string>("");
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);

  // fetch data
  const { data, isLoading, mutate } = useFetch<null, WordSuggestion[]>({ url: "/all_words_with_suggesions" });

  // get data
  const wordData = useMemo(() => data?.data ?? [], [data]);

  const onPanelOpen = (e: MouseEvent, id?: string) => {
    if (id) {
      mutate();
      setCurrentRowId(id);
    } else {
      setCurrentRowId("");
    }
    setIsPanelOpen(true);
  };

  const columns = wordAddcolumns(onPanelOpen);

  const table = useReactTable({
    data: wordData,
    columns,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
      columnVisibility: { illegal_for_filter: false },
    },
  });

  const selectedIllegalWords = useMemo(
    () => table.getSelectedRowModel().flatRows.map(row => row.original),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [table.getSelectedRowModel()],
  );

  const { trigger: removeIllegalWord } = useMutation<RemoveIllegalWordRequest, string>(
    "post",
    "/remove_illegal_words",
    {
      onSuccess: () => {
        mutate();
        setIsConfirmDeleteDialogOpen(false);
        table.resetRowSelection();
      },
    },
  );

  const currentRow = table.getRowModel().rows.find(row => row.id === currentRowId);

  const hasSelectedRow = table.getIsSomeRowsSelected() || table.getIsAllRowsSelected();

  const toggleTableMode = () => {
    setIsTableMode(state => {
      return !state;
    });
  };

  const handleRemoveIllegalWord = () => {
    if (selectedIllegalWords.length === 0) {
      return;
    }
    const removeWordList = selectedIllegalWords.map(illegalWord => illegalWord.illegal_word);
    removeIllegalWord({ illegal_words: removeWordList });
  };

  const onPanelClose = () => {
    setIsPanelOpen(false);
  };

  return (
    <>
      <div className="container flex flex-col overflow-hidden p-8">
        <div className="mb-2 items-center justify-between md:flex">
          <div className="flex text-lg font-bold">
            <Container />
            <span className="ml-4">字詞管理</span>
          </div>
          <div className="flex items-center justify-end">
            {!isTableMode ? (
              <>
                <Button
                  onClick={() => table.toggleAllPageRowsSelected(!table.getIsAllRowsSelected())}
                  size="sm"
                  variant="ghost"
                  className="text-sm"
                >
                  {table.getIsAllRowsSelected() ? "取消全選" : "全選"}
                </Button>
                <div className="px-4 py-2">
                  <Separator orientation="vertical" className="h-4" />
                </div>{" "}
              </>
            ) : null}
            <Button onClick={onPanelOpen} size="sm" variant="ghost" className="text-sm">
              <Plus size={20} />
              <span className="hidden sm:block">添加</span>
            </Button>
            <div className="px-4 py-2">
              <Separator orientation="vertical" className="h-4" />
            </div>{" "}
            <Button size="icon" variant="ghost" onClick={toggleTableMode}>
              {isTableMode ? <Table size={20} /> : <LayoutGrid size={20} />}
            </Button>
            <div className="px-4 py-2">
              <Separator orientation="vertical" className="h-4" />
            </div>
            <DeleteConfirmDialog
              isOpen={isConfirmDeleteDialogOpen}
              onOpenChange={setIsConfirmDeleteDialogOpen}
              isDisabled={!hasSelectedRow}
              onIllegalWordRemove={handleRemoveIllegalWord}
              seletedLength={table.getSelectedRowModel().rows.length}
            />
          </div>
        </div>
        {isLoading ? (
          <Loader2 className="mx-auto animate-spin text-input" />
        ) : (
          <>
            <div className="relative mb-2">
              <Input
                onChange={debounce(event => {
                  setGlobalFilter(event.target.value);
                  table.resetRowSelection();
                }, 500)}
                placeholder="搜尋關鍵字"
              />
              <Search size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-input" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <DataGrid onPanelOpen={onPanelOpen} table={table} className={isTableMode ? "hidden" : "grid"} />
              <DataTable className={cn("overflow-auto fade-out", !isTableMode ? "hidden" : "block")} table={table} />
            </div>
          </>
        )}
      </div>

      <AddWordPannel isOpen={isPanelOpen} onClose={onPanelClose} row={currentRow} table={table} />
    </>
  );
}
