"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { cn } from "@/utils/utils";
import { flexRender, Table } from "@tanstack/react-table";

interface IDataTableProps<TData, TValue> {
  className?: string;
  table: Table<TData>;
  isLoading?: boolean;
}

export function DataTable<TData, TValue>({ className, table, isLoading }: IDataTableProps<TData, TValue>) {
  return (
    <div className={cn("rounded-md border bg-white dark:bg-zinc-950", className)}>
      <table className="w-full text-sm">
        <TableHeader className="sticky top-0 bg-white shadow-md dark:bg-zinc-950">
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map(row =>
              isLoading ? (
                <TableRow key={row.id}>
                  <TableCell colSpan={table.getAllColumns().length}>
                    <Skeleton className="h-8 w-full" />
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ),
            )
          ) : (
            <TableRow>
              <TableCell colSpan={table.getAllColumns().length}>查無資料 </TableCell>
            </TableRow>
          )}
        </TableBody>
      </table>
    </div>
  );
}
