"use client";
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
      <DataTable
        columns={columns}
        data={timesheetsData ?? []}
        timesheetWithInputTimes={timesheetsData ?? []}
      />
    </Suspense>
  );
};
export default ClientData;
