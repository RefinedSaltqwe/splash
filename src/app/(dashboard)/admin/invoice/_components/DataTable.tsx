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
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAction } from "@/hooks/useAction";
import { cn } from "@/lib/utils";
import { deleteInvoice } from "@/server/actions/delete-invoice";
import { useCustomerList } from "@/stores/useCustomersList";
import { useDeleteManyModal } from "@/stores/useDeleteManyModal";
import { type Customer, type Invoice } from "@prisma/client";
import { Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { DataTableFilters } from "./DataTableFilters";

interface DataTableInvoiceProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  invoice: Invoice[];
  customersData: Customer[] | undefined;
}

const extractTableIndex = (data: object) => {
  const inputObject = data;
  // Extract keys
  const keysArray = Object.keys(inputObject);
  const keysAsNumbersArray = keysArray.map(Number);
  return keysAsNumbersArray;
};

const extractRowIds = (rows: number[], inv: Invoice[]) => {
  const paymentData = inv;
  const extract: string[] = []; // Initialize extract as an empty array
  paymentData.forEach((value, index) => {
    if (rows.includes(index)) {
      extract.push(value.id);
    }
  });
  return extract;
};

export function DataTable<TData, TValue>({
  columns,
  data,
  invoice,
  customersData,
}: DataTableInvoiceProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilterString, setGlobalFilterString] = useState("");
  const onDeleteModalOpen = useDeleteManyModal((state) => state.onOpen);
  const proceed = useDeleteManyModal((state) => state.proceed);
  const onClose = useDeleteManyModal((state) => state.onClose);
  const onIsProceed = useDeleteManyModal((state) => state.onIsProceed);
  const ids = useDeleteManyModal((state) => state.modalIds);
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
        customerId: false,
        serviceId: false,
        ...columnVisibility,
      },
      rowSelection,
      globalFilter: globalFilterString,
    },
  });
  const customerList = useCustomerList();

  const searchFilter = useCallback(
    (val: string) => {
      setGlobalFilterString(val);
    },
    [globalFilterString],
  );
  const { execute: executeDeleteInvoice } = useAction(deleteInvoice, {
    onSuccess: (data) => {
      toast.success("Deleted successfully", {
        description: `${
          data.count > 1 ? "Records have" : "Record has"
        } been deleted successfully from the server.`,
      });
      onIsProceed(false);
      onClose();
      setRowSelection({});
    },
    onError: () => {
      toast.error("Error deleting records.");
    },
  });
  const deleteSelecetedUsers = () => {
    const getUsers = extractRowIds(extractTableIndex(rowSelection), invoice);
    onDeleteModalOpen(getUsers);
  };

  useEffect(() => {
    if (proceed) {
      const timer = setTimeout(() => {
        void executeDeleteInvoice({
          id: ids!,
        });
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [proceed]);

  useEffect(() => {
    if (customersData) customerList.setCustomers(customersData);
  }, [customersData]);

  return (
    <div className="flex w-full flex-col pb-6 pt-4">
      {/* More filters */}
      <div className="splash-scroll-x sm: flex border-b-[0px] border-slate-200 sm:border-b-[1px] md:border-b-[0px] lg:border-b-[1px] dark:border-slate-700">
        <Tabs
          defaultValue="All"
          className={cn(
            "w-max-[400px] flex flex-row space-x-4 border-b-[1px] border-slate-200 sm:mx-5 sm:border-b-[0px] md:mx-0 md:border-b-[1px] lg:mx-5 lg:border-b-[0px] dark:border-slate-700",
          )}
          onValueChange={(value) => {
            table
              .getColumn("status")
              ?.setFilterValue(value === "All" ? "" : value);
          }}
        >
          <TabsList className="items-end bg-transparent p-0">
            <TabsTrigger
              value="All"
              className="rounded-none border-0 border-b-2 border-l-0 border-b-transparent data-[state=active]:border-b-foreground data-[state=active]:bg-transparent"
            >
              All
              <div className="ml-2 h-auto w-6 rounded-md bg-slate-300/60 dark:bg-slate-200/40">
                <span className="text-slate-800 dark:text-slate-100">
                  {invoice.length}
                </span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="1"
              className="rounded-none border-0 border-b-2 border-l-0 border-b-transparent data-[state=active]:border-b-foreground data-[state=active]:bg-transparent"
            >
              Paid
              <div className="ml-2 h-auto w-6 rounded-md bg-green-500/20">
                <span className="text-green-500">
                  {invoice.filter((item) => item.status === "1").length}
                </span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="2"
              className="rounded-none border-0 border-b-2 border-l-0 border-b-transparent data-[state=active]:border-b-foreground data-[state=active]:bg-transparent"
            >
              Partially Paid
              <div className="ml-2 h-auto w-6 rounded-md bg-yellow-500/20">
                <span className="text-yellow-500">
                  {invoice.filter((item) => item.status === "2").length}
                </span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="3"
              className="rounded-none border-0 border-b-2 border-l-0 border-b-transparent data-[state=active]:border-b-foreground data-[state=active]:bg-transparent"
            >
              Unpaid
              <div className="ml-2 h-auto w-6 rounded-md bg-orange-500/20">
                <span className="text-orange-500">
                  {invoice.filter((item) => item.status === "3").length}
                </span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="4"
              className="rounded-none border-0 border-b-2 border-l-0 border-b-transparent data-[state=active]:border-b-foreground data-[state=active]:bg-transparent"
            >
              Overdue
              <div className="ml-2 h-auto w-6 rounded-md bg-red-500/20">
                <span className="text-red-500">
                  {invoice.filter((item) => item.status === "4").length}
                </span>
              </div>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

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
                        >
                          <Trash2
                            size={16}
                            className="text-primary brightness-100 saturate-200"
                          />
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
