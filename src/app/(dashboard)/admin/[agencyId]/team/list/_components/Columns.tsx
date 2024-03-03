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
import { cn } from "@/lib/utils";
import { type GetAllUsersInAgency } from "@/types/prisma";
import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Copy, MoreHorizontal } from "lucide-react";
import Link from "next/link";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<GetAllUsersInAgency>[] = [
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
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const data = row.original;
      const fullname = `${data ? data.name : ""}`;
      return (
        <Link
          href={`/admin/${data?.agencyId}/team/list/update/${data?.id}`}
          className="text-left font-medium hover:cursor-pointer hover:underline"
        >
          <span className="overflow-hidden text-ellipsis whitespace-nowrap">
            {fullname}
          </span>
        </Link>
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

      if (rowData?.status === "Active") {
        color = "green";
      } else if (rowData?.status === "Disabled") {
        color = "yellow";
      } else if (rowData?.status === "Pending") {
        color = "orange";
      } else if (rowData?.status === "Terminated") {
        color = "red";
      }
      return (
        <Badge
          className={cn(
            `bg-${color}-500/20 text-${color}-500 hover:bg-${color}-500/20`,
          )}
        >
          {rowData?.status}
        </Badge>
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
    cell: ({ row }) => {
      const rowData = row.original;
      return (
        <Badge className={cn(`min-w-[100px] justify-center bg-slate-600`)}>
          <span className="text-medium overflow-hidden text-ellipsis whitespace-nowrap capitalize">
            {rowData?.role}
          </span>
        </Badge>
      );
    },
  },
  {
    accessorKey: "SubAccount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Owned Accounts" />
    ),
    cell: ({ row }) => {
      const isAgencyOwner = row.getValue("role") === "AGENCY_OWNER";
      const ownedAccounts = row.original?.Permissions.filter(
        (per) => per?.access,
      );

      if (isAgencyOwner) {
        return (
          <div className="flex flex-col items-start">
            <div className="flex flex-col gap-2">
              <Badge className="whitespace-nowrap bg-slate-600">
                Agency - {row?.original?.Agency?.name}
              </Badge>
            </div>
          </div>
        );
      }
      return (
        <div className="flex flex-col items-start">
          <div className="flex flex-col gap-2">
            {ownedAccounts?.length ? (
              ownedAccounts.map((account) => (
                <Badge
                  key={account?.id}
                  className="w-fit whitespace-nowrap bg-slate-600"
                >
                  Sub Account - {account?.SubAccount.name}
                </Badge>
              ))
            ) : (
              <div className="text-muted-foreground">No Access Yet</div>
            )}
          </div>
        </div>
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
    cell: ({ row }) => {
      return (
        <span className="font-medium text-muted-foreground">
          {row.original?.email}
        </span>
      );
    },
  },
  {
    accessorKey: "phoneNumber",
    header: () => <div className="text-left">Phone Number</div>,
    cell: ({ row }) => {
      return (
        <span className="text-medium overflow-hidden text-ellipsis whitespace-nowrap text-muted-foreground">
          {row.original?.phoneNumber}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
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
              <DropdownMenuItem
                className="flex gap-2"
                onClick={() => navigator.clipboard.writeText(user?.email ?? "")}
              >
                <Copy size={15} /> Copy Email
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <Link
                href={`/admin/${user?.agencyId}/team/list/update/${user?.id}`}
                className="text-left hover:cursor-pointer"
              >
                <DropdownMenuItem>Update</DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
