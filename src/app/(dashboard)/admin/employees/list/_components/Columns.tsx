"use client";

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
import { cn } from "@/lib/utils";
import { type User } from "@/types";
import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react";
import Link from "next/link";
import { DataTableColumnHeader } from "@/app/(dashboard)/_components/datatable/DataTableColumnHeader";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<User>[] = [
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
    id: "fullname",
    header: "Full Name",
    cell: ({ row }) => {
      const data = row.original;
      const fullname = `${data.firstname} ${data.lastname}`;
      return (
        <Link
          href={`/admin/employees/list/update/${data.id}`}
          className="text-right font-medium hover:cursor-pointer hover:underline"
        >
          {fullname}
        </Link>
      );
    },
  },
  {
    accessorKey: "firstname",
    header: "First Name",
    cell: ({ row }) => {
      const data = row.original;
      return (
        <span
          onClick={() =>
            console.log("Columns.tsx: line 97: ", row.getValue("id"))
          }
          className="text-right font-medium hover:cursor-pointer hover:underline"
        >
          {data.firstname}
        </span>
      );
    },
  },
  {
    accessorKey: "lastname",
    header: "Last Name",
    cell: ({ row }) => {
      const data = row.original;
      return (
        <span
          onClick={() =>
            console.log("Columns.tsx: line 97: ", row.getValue("id"))
          }
          className="text-right font-medium hover:cursor-pointer hover:underline"
        >
          {data.lastname}
        </span>
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
      let color = "";

      if (rowData.status === "Active") {
        color = "green";
      } else if (rowData.status === "Disabled") {
        color = "yellow";
      } else if (rowData.status === "Pending") {
        color = "orange";
      } else if (rowData.status === "Terminated") {
        color = "red";
      }
      return (
        <Badge
          className={cn(
            `bg-${color}-500/20 text-${color}-500 hover:bg-${color}-500/20`,
          )}
        >
          {rowData.status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent"
        >
          <span className="sr-only">Email</span>
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent"
        >
          <span className="sr-only">Role</span>
          Role
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "phoneNumber",
    header: () => <div className="text-left">Phone Number</div>,
    cell: ({ row }) => {
      return <span>{row.original.phoneNumber}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <div className="flex flex-row space-x-1 text-muted-foreground">
          <Button
            variant="ghost"
            size={"icon"}
            className="rounded-full hover:!bg-muted-foreground/20"
            onClick={() => console.log(payment.id)}
          >
            <span className="sr-only">Edit</span>
            <Pencil size={20} />
          </Button>
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
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(payment.id)}
              >
                Copy payment ID
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log(payment.id)}>
                View customer
              </DropdownMenuItem>
              <DropdownMenuItem>View payment details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
