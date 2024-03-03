"use client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fields, rowKeys, rowName } from "@/constants/defaultsValues";
import {
  cn,
  floatToTwoDecimal,
  formatDateTime,
  getDayWithSpecificDate,
} from "@/lib/utils";
import { type TimesheetWithInputTimes } from "@/types/prisma";
import React, { useCallback } from "react";
import TimeInput from "./TimeInput";

type TimeSheetTableProps = {
  timesheets: TimesheetWithInputTimes[];
  stagnantTimesheet: TimesheetWithInputTimes;
  setTimesheets: React.Dispatch<
    React.SetStateAction<TimesheetWithInputTimes[]>
  >;
};

const TimeSheetTable = ({
  stagnantTimesheet,
  timesheets,
  setTimesheets,
}: TimeSheetTableProps) => {
  const timesheetId = stagnantTimesheet ? stagnantTimesheet?.id : "";
  const activeTimesheet = Object.values(timesheets).filter(
    (timesheet) => timesheet?.id === timesheetId,
  );

  const dateFr = stagnantTimesheet!.dateFr;
  const dateSplitter = (num: number) => {
    return formatDateTime(getDayWithSpecificDate(num, dateFr)).dateTime.split(
      ",",
    );
  };
  const onSetTimesheets = useCallback(
    (timesheetId: string, newTimesheet: TimesheetWithInputTimes) => {
      setTimesheets((prev) => [
        ...prev.filter((timesheet) => timesheet?.id !== timesheetId),
        newTimesheet,
      ]);
    },
    [activeTimesheet[0]],
  );

  return (
    <Table>
      {/* <TableCaption>A list of your recent timesheets.</TableCaption> */}
      <TableHeader>
        <TableRow
          className={cn(
            "border-b-slate-200 bg-slate-100/80 dark:border-b-slate-700 dark:bg-slate-500/20 dark:hover:bg-slate-500/20",
          )}
        >
          <TableHead className="w-[100px]">Date</TableHead>
          {Array.from({ length: 7 }, (_, i) => {
            const num = i + 1;
            return (
              <TableHead
                key={num}
                className={cn(
                  (num == 1 || num == 7) && "bg-red-500/20 text-red-500",
                )}
              >
                <div className="flex w-full flex-col text-center ">
                  <span>{dateSplitter(num)[1]}</span>
                  <span>{dateSplitter(num)[0]}</span>
                </div>
              </TableHead>
            );
          })}
          <TableHead>
            <div className="flex w-full flex-col overflow-hidden text-ellipsis whitespace-nowrap text-center">
              <span>Total</span>
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rowKeys.map((rowKey) => {
          return (
            <TableRow
              key={rowKey}
              className="border-b-slate-200 dark:border-b-slate-700"
            >
              <TableCell className="overflow-hidden text-ellipsis whitespace-nowrap font-medium">
                {rowName[rowKey]}
              </TableCell>
              {fields.map((day, index) => {
                const num = index + 1;
                return (
                  <TableCell
                    key={rowKey + day}
                    className={cn(
                      (num == 1 || num == 7) &&
                        "bg-slate-200/30 dark:bg-slate-700/40",
                    )}
                  >
                    <TimeInput
                      timeInput={activeTimesheet[0]![rowKey]}
                      activeTimesheet={activeTimesheet[0]}
                      onSetTimesheets={onSetTimesheets}
                      field={day}
                      rowKey={rowKey}
                      theDate={getDayWithSpecificDate(num, dateFr)}
                    />
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
      </TableBody>
      <TableFooter className="border-t-slate-200 dark:border-t-slate-700">
        <TableRow className="border-t-slate-200 dark:border-t-slate-700">
          <TableCell>Total</TableCell>
          {fields.map((day) => {
            const tTotal = activeTimesheet[0]?.timeTotal?.[day];
            let timeTotalResult;
            if (tTotal === 0) {
              timeTotalResult = 0;
            } else {
              timeTotalResult = tTotal;
            }
            timeTotalResult = timeTotalResult ? timeTotalResult : 0;
            return (
              <TableCell
                key={day}
                className={cn(
                  "text-center ",
                  (day === "sun" || day === "sat") &&
                    "bg-slate-200/30 dark:bg-slate-700/30 ",
                )}
              >
                {floatToTwoDecimal(timeTotalResult)}
              </TableCell>
            );
          })}
          <TableCell className="text-center">
            {activeTimesheet[0]?.timeTotal?.total == 0
              ? "0.00"
              : floatToTwoDecimal(activeTimesheet[0]!.timeTotal!.total)}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

TimeSheetTable.Skeleton = function SkeletonNavItem() {
  return (
    <div className="flex w-full flex-col px-2 py-5">
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-10 w-full bg-muted-foreground/10" />
        <div className="grid grid-cols-9 gap-2">
          <Skeleton className="h-10 bg-muted-foreground/10" />
          <Skeleton className="h-10 bg-muted-foreground/10" />
          <Skeleton className="h-10 bg-muted-foreground/10" />
          <Skeleton className="h-10 bg-muted-foreground/10" />
          <Skeleton className="h-10 bg-muted-foreground/10" />
          <Skeleton className="h-10 bg-muted-foreground/10" />
          <Skeleton className="h-10 bg-muted-foreground/10" />
          <Skeleton className="h-10 bg-muted-foreground/10" />
          <Skeleton className="h-10 bg-muted-foreground/10" />
        </div>
        <div className="grid grid-cols-9 gap-2">
          <Skeleton className="h-10 bg-muted-foreground/10" />
          <Skeleton className="h-10 bg-muted-foreground/10" />
          <Skeleton className="h-10 bg-muted-foreground/10" />
          <Skeleton className="h-10 bg-muted-foreground/10" />
          <Skeleton className="h-10 bg-muted-foreground/10" />
          <Skeleton className="h-10 bg-muted-foreground/10" />
          <Skeleton className="h-10 bg-muted-foreground/10" />
          <Skeleton className="h-10 bg-muted-foreground/10" />
          <Skeleton className="h-10 bg-muted-foreground/10" />
        </div>
      </div>
    </div>
  );
};
export default TimeSheetTable;
