"use client";
import Card from "@/app/(dashboard)/_components/containers/Card";
import { getServiceTypes } from "@/server/actions/fetch";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { columns } from "./Columns";
import { DataTable } from "./DataTable";

const ServiceList: React.FC = () => {
  const { data: serviceTypeData } = useQuery({
    queryFn: () => getServiceTypes(),
    queryKey: ["serviceTypes"],
  });
  if (!serviceTypeData) {
    return <div>Loading...</div>;
  }
  return (
    <Card padding={false}>
      <DataTable
        columns={columns}
        data={serviceTypeData}
        serviceType={serviceTypeData}
      />
    </Card>
  );
};
export default ServiceList;
