"use client";
import Card from "@/app/(dashboard)/_components/containers/Card";
import { getSuppliers } from "@/server/actions/fetch";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { columns } from "./Columns";
import { DataTable } from "./DataTable";

type SupplierListProps = {
  agencyId: string;
};

const SupplierList: React.FC<SupplierListProps> = ({ agencyId }) => {
  const { data: supplierData } = useQuery({
    queryFn: () => getSuppliers(agencyId),
    queryKey: ["suppliers", agencyId],
  });
  if (!supplierData) {
    return <div>Loading...</div>;
  }
  return (
    <Card padding={false}>
      <DataTable columns={columns} data={supplierData} users={supplierData} />
    </Card>
  );
};
export default SupplierList;
