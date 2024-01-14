"use client";
import Card from "@/app/(dashboard)/_components/containers/Card";
import { getCustomers } from "@/server/actions/fetch";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { columns } from "./Columns";
import { DataTable } from "./DataTable";

const CustomerList: React.FC = () => {
  const { data: customersData } = useQuery({
    queryFn: () => getCustomers(),
    queryKey: ["customers"],
  });
  if (!customersData) {
    return <div>Loading...</div>;
  }
  return (
    <Card padding={false}>
      <DataTable columns={columns} data={customersData} users={customersData} />
    </Card>
  );
};
export default CustomerList;
