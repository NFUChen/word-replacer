import { Table } from "@tanstack/react-table";
import { WordSuggestion } from "./columns";
import { cn } from "@/utils/utils";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Edit2, CircleOff } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { MouseEvent } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface IDataGrid {
  table: Table<WordSuggestion>;
  className?: string;
  isLoading?: boolean;
  onPanelOpen(e: MouseEvent, id?: string): void;
}

export const DataGrid: React.FC<IDataGrid> = ({ table, className, isLoading, onPanelOpen }) => {
  return (
    <>
      <div className={cn("w-full grid-cols-1 gap-4 overflow-auto fade-out sm:grid-cols-2 lg:grid-cols-3", className)}>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map(row =>
            isLoading ? (
              <Skeleton key={row.id} className="w-full h-36" />
            ) : (
              <Card
                onClick={() => row.toggleSelected(!row.getIsSelected())}
                className="flex cursor-pointer flex-col p-4 transition-colors hover:border-blue-400 hover:dark:border-blue-800"
                key={row.id}
              >
                <CardTitle className="text-md mb-2 flex items-center">
                  <div>
                    <div className="text-xs font-normal text-zinc-400">危險字詞</div>
                    <div className="text-md tracking-wider">{row.getValue("illegal_word") as string}</div>
                  </div>
                  <Button
                    onClick={(e: MouseEvent) => {
                      e.stopPropagation();
                      onPanelOpen(e, row.id);
                    }}
                    size="icon"
                    variant="ghost"
                    className="ml-auto h-auto py-2"
                  >
                    <Edit2 size={16} className="text-blue-500" />
                  </Button>
                </CardTitle>
                <Separator />
                <CardContent className="flex flex-auto flex-col px-0 py-2">
                  <div className="mb-2 text-xs text-zinc-400">建議用詞</div>
                  <div className="mb-2 flex flex-auto flex-wrap gap-2">
                    {(row.getValue("suggestions") as string[]).map(word => {
                      return (
                        <Badge key={word} variant="outline" className="h-min justify-center">
                          {word}
                        </Badge>
                      );
                    })}
                  </div>
                  <div className="flex justify-end">
                    <Checkbox
                      className="data-[state=checked]:bg-blue-400"
                      checked={row.getIsSelected()}
                      onCheckedChange={value => row.toggleSelected(!!value)}
                      aria-label="Select row"
                    />
                  </div>
                </CardContent>
              </Card>
            ),
          )
        ) : (
          <div className="flex items-center px-4">
            <CircleOff size={16} />
            <span className="ml-2">查無資料</span>
          </div>
        )}
      </div>
    </>
  );
};
