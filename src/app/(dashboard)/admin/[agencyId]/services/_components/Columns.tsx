"use client";

import { DataTableColumnHeader } from "@/app/(dashboard)/_components/datatable/DataTableColumnHeader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useDeleteManyModal } from "@/stores/useDeleteManyModal";
import { useServiceModal } from "@/stores/useServiceModal";
import { type ServiceType } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<ServiceType>[] = [
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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const data = row.original;
      return (
        <span
          onClick={() =>
            console.log("Columns.tsx: line 97: ", row.getValue("id"))
          }
          className="min-w-[1000px] text-right font-medium hover:cursor-pointer hover:underline"
        >
          {data.name}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const item = row.original;
      const serviceTypeModal = useDeleteManyModal();
      const serviceModal = useServiceModal();
      return (
        <div className="flex flex-row justify-end space-x-1 text-muted-foreground">
          <Button
            variant="ghost"
            className="rounded-full hover:!bg-muted-foreground/20"
            size={"icon"}
            onClick={() => serviceModal.onUpdate(item.id, item.name)}
          >
            <Pencil size={20} />
          </Button>
          <Button
            variant="ghost"
            size={"icon"}
            className="rounded-full hover:!bg-destructive/20"
            onClick={() => serviceTypeModal.onOpen([item.id], "serviceType")}
          >
            <Trash2 className="text-destructive" size={20} />
          </Button>
        </div>
      );
    },
  },
];
