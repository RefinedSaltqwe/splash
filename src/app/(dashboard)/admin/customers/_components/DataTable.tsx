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
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAction } from "@/hooks/useAction";
import { cn } from "@/lib/utils";
import { deleteCustomers } from "@/server/actions/delete-customers";
import { type Customer } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { DataTableFilters } from "./DataTableFilters";
import { useDeleteCustomersModal } from "@/stores/useDeleteCustomersModal";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  users: Customer[];
}

const extractTableIndex = (data: object) => {
  const inputObject = data;
  // Extract keys
  const keysArray = Object.keys(inputObject);
  const keysAsNumbersArray = keysArray.map(Number);
  return keysAsNumbersArray;
};

const extractRowIds = (rows: number[], users: Customer[]) => {
  const data = users;
  const extract: string[] = []; // Initialize extract as an empty array
  data.forEach((value, index) => {
    if (rows.includes(index)) {
      extract.push(value.id);
    }
  });
  return extract;
};

export function DataTable<TData, TValue>({
  columns,
  data,
  users,
}: DataTableProps<TData, TValue>) {
  //! var
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilterString, setGlobalFilterString] = useState("");
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
      rowSelection,
      globalFilter: globalFilterString,
    },
  });

  const modalIds = useDeleteCustomersModal((state) => state.modalIds);
  const isProceed = useDeleteCustomersModal((state) => state.proceed);
  const onIsProceed = useDeleteCustomersModal((state) => state.onIsProceed);
  const onClose = useDeleteCustomersModal((state) => state.onClose);
  const customersModal = useDeleteCustomersModal();

  const queryClient = useQueryClient();
  const { execute, isLoading } = useAction(deleteCustomers, {
    onError: (error) => {
      toast.error(error, {
        duration: 2000,
      });
    },
    onComplete: () => {
      toast.success(
        `${
          modalIds?.length && modalIds?.length > 1
            ? "Customers have"
            : "Customer has"
        } been deleted.`,
      );
      //? Refetch the updated customer data
      void queryClient.invalidateQueries({
        queryKey: ["customer"],
      });
      setRowSelection([]);
      onIsProceed(false);
      onClose();
    },
  });

  const searchFilter = useCallback(
    (val: string) => {
      setGlobalFilterString(val);
    },
    [globalFilterString],
  );
  const deleteSelecetedUsers = () => {
    const getUsers = extractRowIds(extractTableIndex(rowSelection), users);
    customersModal.onOpen(getUsers);
  };

  useEffect(() => {
    if (isProceed) {
      void execute({
        ids: modalIds!,
      });
    } else {
      return;
    }
  }, [isProceed]);

  return (
    <div className="flex w-full flex-col pb-6 pt-4">
      {/* Header */}
      <div className="flex w-full items-center px-5 py-4 ">
        {/* Filters */}
        <DataTableFilters
          table={table}
          globalFilterString={globalFilterString}
          searchFilter={searchFilter}
        />
      </div>
      {/* Data Table */}
      <div className="border-b-[1px] border-b-slate-200 dark:border-b-slate-700">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className={cn(
                  "border-b-slate-200 bg-slate-100/80 dark:border-b-slate-700 dark:bg-slate-500/20 dark:hover:bg-slate-500/20",
                  extractTableIndex(rowSelection).length > 0 &&
                    "!bg-primary/30",
                )}
              >
                {headerGroup.headers.map((header, index) => {
                  const selectedRowsLength =
                    extractTableIndex(rowSelection).length;
                  if (
                    (index === 0 && selectedRowsLength > 0) ||
                    selectedRowsLength === 0
                  ) {
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
                  } else if (
                    index === headerGroup.headers.length - 1 &&
                    selectedRowsLength !== 0
                  ) {
                    return (
                      <TableHead key={header.id} className="text-right">
                        <Button
                          onClick={deleteSelecetedUsers}
                          variant={"ghost"}
                          size={"sm"}
                          className="rounded-full  hover:bg-primary/20"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <Loader classNames="h-4 w-4 border-2 border-primary brightness-100 saturate-200 border-r-transparent" />
                          ) : (
                            <Trash2
                              size={16}
                              className="text-primary brightness-100 saturate-200"
                            />
                          )}
                        </Button>
                      </TableHead>
                    );
                  } else {
                    return <TableHead key={header.id}></TableHead>;
                  }
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="border-b-slate-200 dark:border-b-slate-700"
                  >
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination and Rows Selected*/}
      <DataTablePagination table={table} />
    </div>
  );
}
