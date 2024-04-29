"use client";
import { getFunnels } from "@/server/actions/fetch";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import React from "react";
import { columns } from "./Columns";
import { FunnelsDataTable } from "./DataTable";

type ClientDataProps = {
  subaccountId: string;
};

const ClientData: React.FC<ClientDataProps> = ({ subaccountId }) => {
  const { data: funnels } = useQuery({
    queryKey: ["funnels", subaccountId],
    queryFn: () => getFunnels(subaccountId),
  });

  if (!funnels) {
    return null;
  }
  return (
    <FunnelsDataTable
      actionButtonText={
        <>
          <Plus size={15} />
          Create funnel
        </>
      }
      subaccountId={subaccountId}
      filterValue="name"
      columns={columns}
      data={funnels}
    />
  );
};
export default ClientData;
