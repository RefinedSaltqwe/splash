"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";

import { DataTablePagination } from "@/app/(dashboard)/_components/datatable/DataTablePagination";
import GlobalModal from "@/components/drawer/GlobalModal";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCallback, useState } from "react";
import { DataTableFilters } from "./DataTableFilter";
import FunnelForm from "./FunnelForm";
import { cn } from "@/lib/utils";

interface FunnelsDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterValue: string;
  actionButtonText?: React.ReactNode;
  modalChildren?: React.ReactNode;
  subaccountId: string;
}

export function FunnelsDataTable<TData, TValue>({
  columns,
  data,
  filterValue,
  subaccountId,
  actionButtonText,
}: FunnelsDataTableProps<TData, TValue>) {
  //! var
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilterString, setGlobalFilterString] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility: {
        id: false,
        ...columnVisibility,
      },
      globalFilter: globalFilterString,
    },
  });

  const searchFilter = useCallback(
    (val: string) => {
      setGlobalFilterString(val);
    },
    [globalFilterString],
  );

  return (
    <div className="flex w-full flex-col pb-6 pt-4">
      {/* Filter */}
      <div className="flex items-center justify-between px-5 py-4 ">
        <DataTableFilters
          globalFilterString={globalFilterString}
          searchFilter={searchFilter}
        />
        <Button className="flex- gap-2" onClick={() => setIsOpen(true)}>
          {actionButtonText}
        </Button>
      </div>
      <div className="border-b-[1px] border-b-slate-200 dark:border-b-slate-700">
        <Table className="">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className={cn(
                  "border-b-slate-200 bg-slate-100/80 dark:border-b-slate-700 dark:bg-slate-500/20 dark:hover:bg-slate-500/20",
                )}
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-b-slate-200 dark:border-b-slate-700"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No Results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination and Rows Selected*/}
      <DataTablePagination table={table} />
      <GlobalModal
        title="Create A Funnel"
        description="Funnels are like websites, but better! Try creating one!"
        setIsOpen={setIsOpen}
        isOpen={isOpen}
      >
        <FunnelForm
          subAccountId={subaccountId}
          setIsOpen={setIsOpen}
        ></FunnelForm>
      </GlobalModal>
    </div>
  );
}
