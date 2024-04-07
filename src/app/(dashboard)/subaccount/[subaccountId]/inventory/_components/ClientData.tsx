"use client";
import Heading from "@/components/shared/Heading";
import { getInventoryListBySubaccountId } from "@/server/actions/fetch";
import { useCurrentUserStore } from "@/stores/useCurrentUser";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import CreateButton from "./CreateButton";
import ItemList from "./ItemList";

type ClientDataProps = {
  agencyId: string;
  subaccountId: string;
};

const ClientData: React.FC<ClientDataProps> = ({ agencyId, subaccountId }) => {
  const { data: inventoryList } = useQuery({
    queryFn: () => getInventoryListBySubaccountId(subaccountId),
    queryKey: ["inventory", subaccountId],
  });
  const inventoryItems = useCurrentUserStore(
    (state) => state.inventoryItemData,
  );

  const setInventoryItemsData = useCurrentUserStore(
    (state) => state.setInventoryItemsData,
  );

  useEffect(() => {
    if (inventoryList && inventoryList.length > 0) {
      setInventoryItemsData(inventoryList);
    }
  }, [inventoryList]);
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Inventory" subTitle="Keep track of what's in stock" />
        <CreateButton subaccountId={subaccountId} agencyId={agencyId} />
      </div>

      <ItemList
        agencyId={agencyId}
        subaccountId={subaccountId}
        inventoryList={inventoryItems}
      />
    </>
  );
};
export default ClientData;
