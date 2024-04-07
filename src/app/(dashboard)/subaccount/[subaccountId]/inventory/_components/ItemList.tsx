"use client";
import Card from "@/app/(dashboard)/_components/containers/Card";
import { type InventoryListBySubaccountIdAndSupplierMaterialsUsed } from "@/types/prisma";
import React, { Suspense } from "react";
import { columns } from "./Columns";
import { DataTable } from "./DataTable";

type ItemListProps = {
  agencyId: string;
  subaccountId: string;
  inventoryList: InventoryListBySubaccountIdAndSupplierMaterialsUsed[];
};

const ItemList: React.FC<ItemListProps> = ({
  agencyId,
  subaccountId,
  inventoryList,
}) => {
  return (
    <Suspense
      fallback={
        <div>
          <span>Loading...</span>
        </div>
      }
    >
      <Card padding={false}>
        <DataTable
          agencyId={agencyId}
          subaccountId={subaccountId}
          columns={columns}
          data={inventoryList ?? []}
          inventoryList={inventoryList ?? []}
        />
      </Card>
    </Suspense>
  );
};
export default ItemList;
