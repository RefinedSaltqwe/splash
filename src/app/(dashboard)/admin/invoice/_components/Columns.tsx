"use client";

import { DataTableColumnHeader } from "@/app/(dashboard)/_components/datatable/DataTableColumnHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  cn,
  convertInvoiceStatus,
  convertStatusToColor,
  formatDateTime,
  formatPrice,
  totalValueWithTax,
} from "@/lib/utils";
import { useCustomerList } from "@/stores/useCustomersList";
import { useDeleteManyModal } from "@/stores/useDeleteManyModal";
import { type Invoice } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<Invoice>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className={cn(
          "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
          "splash-base-input splash-inputs",
        )}
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => {
          table.toggleAllPageRowsSelected(!!value);
        }}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className={cn(
          "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
          "splash-base-input splash-inputs",
        )}
        checked={row.getIsSelected()}
        onCheckedChange={(value) => {
          row.toggleSelected(!!value);
        }}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
  },
  {
    accessorKey: "customerId",
  },
  {
    accessorKey: "serviceId",
  },
  {
    id: "name",
    header: "Supplier Name",
    size: 100,
    cell: ({ row }) => {
      const data = row.original;
      const customerList = useCustomerList((state) => state.customers);
      const person = customerList.filter(
        (person) => person.id === data.customerId,
      );
      const customerName =
        person[0]?.companyName !== "N/A"
          ? person[0]?.companyName
          : person[0]?.name;
      return (
        <div className="flex min-w-[175px] flex-col">
          <Link
            href={`/admin/invoice/view/${data.id}`}
            className="text-left font-medium hover:cursor-pointer hover:underline"
          >
            <span className="w-full">
              {customerName ? (
                customerName
              ) : (
                <Skeleton className="h-4 w-[150px] bg-muted-foreground/20" />
              )}
            </span>
          </Link>
          <span className="text-sm font-normal text-muted-foreground">
            {data.id}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Transaction Date" />
    ),
    cell: ({ row }) => {
      const date = row.original.createdAt;
      return (
        <div className="min-w-[120px] font-medium">
          {formatDateTime(date).dateOnly}
        </div>
      );
    },
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Due Date" />
    ),
    cell: ({ row }) => {
      const date = row.original.dueDate;
      return (
        <div className="min-w-[120px] font-medium">
          {formatDateTime(date).dateOnly}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const rowData = row.original;
      const color = convertStatusToColor(
        rowData.status !== "1"
          ? rowData.dueDate < new Date()
            ? "4"
            : rowData.status
          : rowData.status,
      );
      return (
        <Badge
          className={cn(
            `bg-${color}-500/20 text-${color}-500 hover:bg-${color}-500/20 min-w-[100px] justify-center`,
          )}
        >
          {rowData.status !== "1"
            ? rowData.dueDate < new Date()
              ? convertInvoiceStatus("4")
              : convertInvoiceStatus(rowData.status)
            : convertInvoiceStatus(rowData.status)}
        </Badge>
      );
    },
  },
  {
    id: "total-total",
    header: () => <div className="text-left">Total</div>,
    cell: ({ row }) => {
      const item = row.original;
      const total = totalValueWithTax(
        item.subTotal,
        item.shipping,
        item.discount,
        item.tax,
      );
      const amount = formatPrice(String(total));
      return <div className="text-left font-medium">{amount}</div>;
    },
  },
  {
    accessorKey: "total",
    header: () => <div className="text-left">Balance</div>,
    cell: ({ row }) => {
      const amount = formatPrice(row.getValue("total"));
      return <div className="text-left font-medium">{amount}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const invoice = row.original;
      const onDeleteModalOpen = useDeleteManyModal((state) => state.onOpen);

      return (
        <div className="flex flex-row space-x-1 text-muted-foreground">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size={"icon"}
                className="rounded-full hover:!bg-muted-foreground/20"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-drop-downmenu">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link
                href={`/admin/invoice/update/${invoice.id}`}
                className="text-left hover:cursor-pointer"
              >
                <DropdownMenuItem>Update</DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                onClick={() => onDeleteModalOpen([invoice.id], "invoice")}
                className="hove:text-destructive text-destructive"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
