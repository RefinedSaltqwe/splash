"use client";
import { cn } from "@/lib/utils";
import { type TimesheetWithInputTimes } from "@/types/prisma";
import { type User } from "@prisma/client";
import { ChevronUp } from "lucide-react";
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
  const [isContentHidden, setIsContentHidden] = useState<string[]>([]);

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
            className="flex w-full flex-col border-b-[1px] border-b-slate-200 dark:border-b-slate-700"
          >
            <div className="flex w-full flex-col">
              <div
                onClick={() =>
                  setIsContentHidden((prev) => {
                    if (prev.includes(timesheet!.userId)) {
                      return [...prev.filter((id) => id !== timesheet!.userId)];
                    }
                    return [...prev, timesheet!.userId];
                  })
                }
                className="border-l-3 group flex w-full cursor-pointer flex-row items-center justify-between border-primary bg-slate-100/80 px-5 py-4 dark:bg-slate-500/20 dark:hover:bg-slate-500/20"
              >
                <span className="group-hover:underline">{user[0]?.name}</span>
                <div className="text-muted-foreground">
                  <ChevronUp
                    className={cn(
                      isContentHidden.includes(timesheet!.userId)
                        ? "rotate-180"
                        : "text-muted-foreground",
                      "h-5 w-5 shrink-0",
                    )}
                    aria-hidden="true"
                  />
                </div>
              </div>
              <div
                className={cn(
                  "w-full flex-row",
                  isContentHidden.includes(timesheet!.userId)
                    ? "hidden"
                    : "flex",
                )}
              >
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
