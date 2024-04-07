"use client";
import Card from "@/app/(dashboard)/_components/containers/Card";
import { type TimesheetWithInputTimes } from "@/types/prisma";
import React, { Suspense } from "react";
import { columns } from "./Columns";
import { DataTable } from "./DataTable";

type ClientDataProps = {
  timesheetsData: TimesheetWithInputTimes[];
};

const ClientData: React.FC<ClientDataProps> = ({ timesheetsData }) => {
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
          data={timesheetsData ?? []}
          timesheetWithInputTimes={timesheetsData ?? []}
        />
      </Card>
    </Suspense>
  );
};
export default ClientData;
