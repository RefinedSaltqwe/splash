"use client";

import { DataTableColumnHeader } from "@/app/(dashboard)/_components/datatable/DataTableColumnHeader";
import { Checkbox } from "@/components/ui/checkbox";
import { cn, formatDateTime } from "@/lib/utils";
import { type TimesheetWithInputTimes } from "@/types/prisma";
import { type ColumnDef } from "@tanstack/react-table";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

// This type is used to define the shape of our data.
// You can use a Zod 22schema here if you want.

export const columns: ColumnDef<TimesheetWithInputTimes>[] = [
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
    id: "period",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Period" />
    ),
    cell: ({ row }) => {
      const data = row.original;
      const dateFr = formatDateTime(new Date(data!.dateFr)).dateOnly;
      const dateTo = formatDateTime(new Date(data!.dateTo)).dateOnly;
      return (
        <Link
          href={`/admin/${data?.agencyId}/team/time-sheet/${data?.groupId}`}
          className="flex min-w-[1000px] flex-row items-center justify-start "
        >
          <span className="text-right font-medium hover:cursor-pointer hover:underline">
            {`${dateFr} - ${dateTo} `}
          </span>
          <ExternalLink size={15} className="ml-2" />
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
      const data = row.original;
      const deadline = new Date(data?.dateTo ?? "");
      const currentDate = new Date();
      let status = data?.status;
      if (currentDate > deadline && status === "draft") {
        status = `Overdue (${currentDate.getDate() - deadline.getDate()})`;
      }
      return (
        <span
          className={cn(
            "min-w-[1000px] text-right font-medium capitalize",
            currentDate > deadline && "!text-red-500",
          )}
        >
          {`${status}`}
        </span>
      );
    },
  },
];
