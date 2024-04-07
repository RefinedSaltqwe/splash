"use client";
import Card from "@/app/(dashboard)/_components/containers/Card";
import { getServiceTypes } from "@/server/actions/fetch";
import { useQuery } from "@tanstack/react-query";
import React, { Suspense } from "react";
import { columns } from "./Columns";
import { DataTable } from "./DataTable";

type ServiceListProps = {
  agencyId: string;
};

const ServiceList: React.FC<ServiceListProps> = ({ agencyId }) => {
  const { data: serviceTypeData } = useQuery({
    queryFn: () => getServiceTypes(agencyId),
    queryKey: ["serviceTypes", agencyId],
  });
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
          columns={columns}
          data={serviceTypeData ?? []}
          serviceType={serviceTypeData ?? []}
        />
      </Card>
    </Suspense>
  );
};
export default ServiceList;
