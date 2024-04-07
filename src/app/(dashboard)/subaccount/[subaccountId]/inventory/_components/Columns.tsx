"use client";

import { DataTableColumnHeader } from "@/app/(dashboard)/_components/datatable/DataTableColumnHeader";
import GlobalModal from "@/components/drawer/GlobalModal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn, formatPrice } from "@/lib/utils";
import { useDeleteManyModal } from "@/stores/useDeleteManyModal";
import { type ColumnDef } from "@tanstack/react-table";
import { ChevronRight, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import InventoryForm from "./InventoryForm";
import { type InventoryListBySubaccountIdAndSupplierMaterialsUsed } from "@/types/prisma";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<InventoryListBySubaccountIdAndSupplierMaterialsUsed>[] =
  [
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
          <span className="min-w-[1000px] text-right font-medium">
            {data.name}
          </span>
        );
      },
    },
    {
      id: "supplier",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Supplier" />
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
            <span className="flex flex-row items-center">
              <span>{data.Supplier?.companyName}</span>
              <ChevronRight size={18} className="ml-2" />
            </span>
          </span>
        );
      },
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Description" />
      ),
      cell: ({ row }) => {
        const data = row.original;
        return (
          <span className="min-w-[1000px] text-right font-medium">
            {data.description}
          </span>
        );
      },
    },
    {
      accessorKey: "quantity",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Quantity" />
      ),
      cell: ({ row }) => {
        const data = row.original;
        return (
          <span className="min-w-[1000px] text-right font-medium">
            {data.quantity}
          </span>
        );
      },
    },
    {
      accessorKey: "cost",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Cost" />
      ),
      cell: ({ row }) => {
        const data = row.original;
        return (
          <span className="min-w-[1000px] text-right font-medium">
            {`${formatPrice(String(data.cost))}`}
          </span>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const item = row.original;
        const inventoryModal = useDeleteManyModal();
        const [isOpen, setIsOpen] = useState<boolean>(false);
        return (
          <div className="flex flex-row justify-end space-x-1 text-muted-foreground">
            <Button
              variant="ghost"
              className="rounded-full hover:!bg-muted-foreground/20"
              size={"icon"}
              onClick={() => setIsOpen(true)}
            >
              <Pencil size={20} />
            </Button>
            <Button
              variant="ghost"
              size={"icon"}
              className="rounded-full hover:!bg-destructive/20"
              onClick={() => inventoryModal.onOpen([item.id], "inventory")}
            >
              <Trash2 className="text-destructive" size={20} />
            </Button>
            <GlobalModal
              title="Inventory item"
              description="Create or update item information."
              setIsOpen={setIsOpen}
              isOpen={isOpen}
            >
              <InventoryForm
                agencyId={item.agencyId}
                subaccountId={item.subaccountId ?? ""}
                setIsOpen={setIsOpen}
                inventoryDetails={item}
              />
            </GlobalModal>
          </div>
        );
      },
    },
  ];
