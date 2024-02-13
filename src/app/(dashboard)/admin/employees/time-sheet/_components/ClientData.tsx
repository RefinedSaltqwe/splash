"use client";
import { type TimesheetWithInputTimes } from "@/types/prisma";
import { type User } from "@prisma/client";
import React, { useEffect, useState } from "react";
import TimeSheetTable from "../../list/_components/TimeSheetTable";

type ClientDataProps = {
  timesheetsData: TimesheetWithInputTimes[];
  usersData: User[];
};

const ClientData: React.FC<ClientDataProps> = ({
  timesheetsData,
  usersData,
}) => {
  const [timesheets, setTimesheets] = useState<TimesheetWithInputTimes[]>([]);

  useEffect(() => {
    setTimesheets(timesheetsData ? timesheetsData : []);
  }, [timesheetsData]);

  console.log("Client Data Timesheets: ", timesheets);
  if (timesheets.length === 0) {
    return (
      <div className="flex w-full flex-col">
        <TimeSheetTable.Skeleton />
        <TimeSheetTable.Skeleton />
        <TimeSheetTable.Skeleton />
      </div>
    );
  }
  return (
    <div className="flex w-full flex-col py-5">
      {timesheetsData?.map((timesheet) => {
        const user = usersData?.filter((user) => user.id === timesheet?.userId);
        return (
          <div
            key={timesheet?.id}
            className="flex w-full flex-col border-b-slate-200 dark:border-b-slate-700"
          >
            <div className="flex w-full flex-col">
              <div className="flex w-full flex-row items-center justify-between bg-slate-100/80 px-5 py-4 dark:bg-slate-500/20 dark:hover:bg-slate-500/20">
                <span>{user[0]?.name}</span>
                <div>arrow</div>
              </div>
              <div className="flex w-full flex-row">
                <TimeSheetTable
                  timesheets={timesheets}
                  setTimesheets={setTimesheets}
                  stagnantTimesheet={timesheet}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default ClientData;
