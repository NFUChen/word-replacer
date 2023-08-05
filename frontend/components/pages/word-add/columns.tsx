import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ColumnDef } from "@tanstack/react-table";
import { AlertCircle, Edit2Icon } from "lucide-react";
import { MouseEvent } from "react";

export type WordSuggestion = {
  id: string;
  illegal_word: string;
  suggestions: string[];
};

export const wordAddcolumns = (actionFn: (e: MouseEvent, id?: string) => void): ColumnDef<WordSuggestion>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="data-[state=checked]:bg-blue-400"
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="data-[state=checked]:bg-blue-400"
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "illegal_word",
    header: () => <div className="whitespace-nowrap">危險字詞</div>,
    cell: ({ row, table }) => {
      const illegalWords = row.getValue("illegal_word") as string;

      const comparisonArray = table
        .getRowModel()
        .rows.slice(0, table.getRowModel().rows.indexOf(row))
        .map(row => row.getValue("illegal_word"));

      const hasDuplicated = comparisonArray.indexOf(illegalWords) >= 0;

      return (
        <div className="flex items-center whitespace-nowrap">
          {illegalWords}
          {hasDuplicated ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <AlertCircle size={16} className="ml-2 text-destructive" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">相同字詞已存在，校正結果可能會不符預期</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : null}
        </div>
      );
    },
  },
  {
    accessorKey: "suggestions",
    header: () => <div className="whitespace-nowrap">建議用詞</div>,
    cell: ({ row }) => (
      <div className="flex gap-2">
        {(row.getValue("suggestions") as string[]).map((suggestionWord, index) => {
          if (index < 5) {
            return (
              <Badge className="whitespace-nowrap" variant="outline" key={suggestionWord}>
                {suggestionWord}
              </Badge>
            );
          }
        })}
        {(row.getValue("suggestions") as string[]).length > 5 ? <div className="whitespace-nowrap">...</div> : null}
      </div>
    ),
  },
  {
    accessorFn: info => info.suggestions.join(""),
    id: "illegal_for_filter",
    enableHiding: true,
  },
  {
    accessorKey: "actions",
    header: () => <div className="text-center">編輯</div>,
    cell: ({ row }) => {
      return (
        <div className="flex justify-center px-4">
          <Button
            onClick={e => {
              actionFn(e, row.id);
            }}
            variant="ghost"
            size="icon"
          >
            <Edit2Icon size={16} className="text-blue-500" />
          </Button>
        </div>
      );
    },
  },
];
