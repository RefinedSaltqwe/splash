"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, formatDateTime, getDayWithSpecificDate } from "@/lib/utils";
import { type TimesheetWithInputTimes } from "@/types/prisma";
import React, { useCallback } from "react";
import TimeInput from "./TimeInput";
import { Skeleton } from "@/components/ui/skeleton";

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
  if (timesheetId == "clrzpd2u3000021odj3bkofnh20240211") {
    console.log("SheetTable: ", activeTimesheet[0]?.timeIn);
  }

  return (
    <Table className="mt-6">
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow
          className={cn(
            "border-b-slate-200 bg-slate-100/80 dark:border-b-slate-700 dark:bg-slate-500/20 dark:hover:bg-slate-500/20",
          )}
        >
          <TableHead className="w-[100px]">Date</TableHead>
          <TableHead className="bg-red-500/20 text-red-500">
            <div className="flex w-full flex-col text-center ">
              <span>{dateSplitter(1)[1]}</span>
              <span>{dateSplitter(1)[0]}</span>
            </div>
          </TableHead>
          <TableHead>
            <div className="flex w-full flex-col text-center">
              <span>{dateSplitter(2)[1]}</span>
              <span>{dateSplitter(2)[0]}</span>
            </div>
          </TableHead>
          <TableHead>
            <div className="flex w-full flex-col text-center">
              <span>{dateSplitter(3)[1]}</span>
              <span>{dateSplitter(3)[0]}</span>
            </div>
          </TableHead>
          <TableHead>
            <div className="flex w-full flex-col text-center">
              <span>{dateSplitter(4)[1]}</span>
              <span>{dateSplitter(4)[0]}</span>
            </div>
          </TableHead>
          <TableHead>
            <div className="flex w-full flex-col text-center">
              <span>{dateSplitter(5)[1]}</span>
              <span>{dateSplitter(5)[0]}</span>
            </div>
          </TableHead>
          <TableHead>
            <div className="flex w-full flex-col text-center">
              <span>{dateSplitter(6)[1]}</span>
              <span>{dateSplitter(6)[0]}</span>
            </div>
          </TableHead>
          <TableHead className="bg-red-500/20 text-red-500">
            <div className="flex w-full flex-col text-center">
              <span>{dateSplitter(7)[1]}</span>
              <span>{dateSplitter(7)[0]}</span>
            </div>
          </TableHead>
          <TableHead>
            <div className="flex w-full flex-col overflow-hidden text-ellipsis whitespace-nowrap text-center">
              <span>Total</span>
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* Time in */}
        <TableRow className="border-b-slate-200 dark:border-b-slate-700">
          <TableCell className="overflow-hidden text-ellipsis whitespace-nowrap font-medium">
            Time-in
          </TableCell>
          <TableCell className="bg-slate-200/30 dark:bg-slate-700/40">
            <TimeInput
              timeInput={activeTimesheet[0]!.timeIn}
              activeTimesheet={activeTimesheet[0]}
              onSetTimesheets={onSetTimesheets}
              field="sun"
              rowKey="timeIn"
              theDate={getDayWithSpecificDate(1, dateFr)}
            />
          </TableCell>
          <TableCell>
            <TimeInput
              timeInput={activeTimesheet[0]!.timeIn}
              activeTimesheet={activeTimesheet[0]}
              onSetTimesheets={onSetTimesheets}
              field="mon"
              rowKey="timeIn"
              theDate={getDayWithSpecificDate(2, dateFr)}
            />
          </TableCell>
          <TableCell>
            <TimeInput
              timeInput={activeTimesheet[0]!.timeIn}
              activeTimesheet={activeTimesheet[0]}
              onSetTimesheets={onSetTimesheets}
              field="tue"
              rowKey="timeIn"
              theDate={getDayWithSpecificDate(3, dateFr)}
            />
          </TableCell>
          <TableCell>
            <TimeInput
              timeInput={activeTimesheet[0]!.timeIn}
              activeTimesheet={activeTimesheet[0]}
              onSetTimesheets={onSetTimesheets}
              field="wed"
              rowKey="timeIn"
              theDate={getDayWithSpecificDate(4, dateFr)}
            />
          </TableCell>
          <TableCell>
            <TimeInput
              timeInput={activeTimesheet[0]!.timeIn}
              activeTimesheet={activeTimesheet[0]}
              onSetTimesheets={onSetTimesheets}
              field="thu"
              rowKey="timeIn"
              theDate={getDayWithSpecificDate(5, dateFr)}
            />
          </TableCell>
          <TableCell>
            <TimeInput
              timeInput={activeTimesheet[0]!.timeIn}
              activeTimesheet={activeTimesheet[0]}
              onSetTimesheets={onSetTimesheets}
              field="fri"
              rowKey="timeIn"
              theDate={getDayWithSpecificDate(6, dateFr)}
            />
          </TableCell>
          <TableCell className="bg-slate-200/30 dark:bg-slate-700/30">
            <TimeInput
              timeInput={activeTimesheet[0]!.timeIn}
              activeTimesheet={activeTimesheet[0]}
              onSetTimesheets={onSetTimesheets}
              field="sat"
              rowKey="timeIn"
              theDate={getDayWithSpecificDate(7, dateFr)}
            />
          </TableCell>
        </TableRow>
        {/* Break out */}
        <TableRow className="border-b-slate-200 dark:border-b-slate-700">
          <TableCell className="overflow-hidden text-ellipsis whitespace-nowrap font-medium">
            Meal Break-out
          </TableCell>
          <TableCell className="bg-slate-200/30 dark:bg-slate-700/40">
            <TimeInput
              timeInput={activeTimesheet[0]!.breakOut}
              activeTimesheet={activeTimesheet[0]}
              onSetTimesheets={onSetTimesheets}
              field="sun"
              rowKey="breakOut"
              theDate={getDayWithSpecificDate(1, dateFr)}
            />
          </TableCell>
          <TableCell>
            <TimeInput
              timeInput={activeTimesheet[0]!.breakOut}
              activeTimesheet={activeTimesheet[0]}
              onSetTimesheets={onSetTimesheets}
              field="mon"
              rowKey="breakOut"
              theDate={getDayWithSpecificDate(2, dateFr)}
            />
          </TableCell>
          <TableCell>
            <TimeInput
              timeInput={activeTimesheet[0]!.breakOut}
              activeTimesheet={activeTimesheet[0]}
              onSetTimesheets={onSetTimesheets}
              field="tue"
              rowKey="breakOut"
              theDate={getDayWithSpecificDate(3, dateFr)}
            />
          </TableCell>
          <TableCell>
            <TimeInput
              timeInput={activeTimesheet[0]!.breakOut}
              activeTimesheet={activeTimesheet[0]}
              onSetTimesheets={onSetTimesheets}
              field="wed"
              rowKey="breakOut"
              theDate={getDayWithSpecificDate(4, dateFr)}
            />
          </TableCell>
          <TableCell>
            <TimeInput
              timeInput={activeTimesheet[0]!.breakOut}
              activeTimesheet={activeTimesheet[0]}
              onSetTimesheets={onSetTimesheets}
              field="thu"
              rowKey="breakOut"
              theDate={getDayWithSpecificDate(5, dateFr)}
            />
          </TableCell>
          <TableCell>
            <TimeInput
              timeInput={activeTimesheet[0]!.breakOut}
              activeTimesheet={activeTimesheet[0]}
              onSetTimesheets={onSetTimesheets}
              field="fri"
              rowKey="breakOut"
              theDate={getDayWithSpecificDate(6, dateFr)}
            />
          </TableCell>
          <TableCell className="bg-slate-200/30 dark:bg-slate-700/30">
            <TimeInput
              timeInput={activeTimesheet[0]!.breakOut}
              activeTimesheet={activeTimesheet[0]}
              onSetTimesheets={onSetTimesheets}
              field="sat"
              rowKey="breakOut"
              theDate={getDayWithSpecificDate(7, dateFr)}
            />
          </TableCell>
        </TableRow>
        {/* Break in */}
        <TableRow className="border-b-slate-200 dark:border-b-slate-700">
          <TableCell className="overflow-hidden text-ellipsis whitespace-nowrap font-medium">
            Meal Break-in
          </TableCell>
          <TableCell className="bg-slate-200/30 dark:bg-slate-700/40">
            <TimeInput
              timeInput={activeTimesheet[0]!.breakIn}
              activeTimesheet={activeTimesheet[0]}
              onSetTimesheets={onSetTimesheets}
              field="sun"
              rowKey="breakIn"
              theDate={getDayWithSpecificDate(1, dateFr)}
            />
          </TableCell>
          <TableCell>
            <TimeInput
              timeInput={activeTimesheet[0]!.breakIn}
              activeTimesheet={activeTimesheet[0]}
              onSetTimesheets={onSetTimesheets}
              field="mon"
              rowKey="breakIn"
              theDate={getDayWithSpecificDate(2, dateFr)}
            />
          </TableCell>
          <TableCell>
            <TimeInput
              timeInput={activeTimesheet[0]!.breakIn}
              activeTimesheet={activeTimesheet[0]}
              onSetTimesheets={onSetTimesheets}
              field="tue"
              rowKey="breakIn"
              theDate={getDayWithSpecificDate(3, dateFr)}
            />
          </TableCell>
          <TableCell>
            <TimeInput
              timeInput={activeTimesheet[0]!.breakIn}
              activeTimesheet={activeTimesheet[0]}
              onSetTimesheets={onSetTimesheets}
              field="wed"
              rowKey="breakIn"
              theDate={getDayWithSpecificDate(4, dateFr)}
            />
          </TableCell>
          <TableCell>
            <TimeInput
              timeInput={activeTimesheet[0]!.breakIn}
              activeTimesheet={activeTimesheet[0]}
              onSetTimesheets={onSetTimesheets}
              field="thu"
              rowKey="breakIn"
              theDate={getDayWithSpecificDate(5, dateFr)}
            />
          </TableCell>
          <TableCell>
            <TimeInput
              timeInput={activeTimesheet[0]!.breakIn}
              activeTimesheet={activeTimesheet[0]}
              onSetTimesheets={onSetTimesheets}
              field="fri"
              rowKey="breakIn"
              theDate={getDayWithSpecificDate(6, dateFr)}
            />
          </TableCell>
          <TableCell className="bg-slate-200/30 dark:bg-slate-700/30">
            <TimeInput
              timeInput={activeTimesheet[0]!.breakIn}
              activeTimesheet={activeTimesheet[0]}
              onSetTimesheets={onSetTimesheets}
              field="sat"
              rowKey="breakIn"
              theDate={getDayWithSpecificDate(7, dateFr)}
            />
          </TableCell>
        </TableRow>
        {/* TIme Out */}
        <TableRow className="border-b-slate-200 dark:border-b-slate-700">
          <TableCell className="overflow-hidden text-ellipsis whitespace-nowrap font-medium">
            Time-out
          </TableCell>
          <TableCell className="bg-slate-200/30 dark:bg-slate-700/40">
            <TimeInput
              timeInput={activeTimesheet[0]!.timeOut}
              activeTimesheet={activeTimesheet[0]}
              onSetTimesheets={onSetTimesheets}
              field="sun"
              rowKey="timeOut"
              theDate={getDayWithSpecificDate(1, dateFr)}
            />
          </TableCell>
          <TableCell>
            <TimeInput
              timeInput={activeTimesheet[0]!.timeOut}
              activeTimesheet={activeTimesheet[0]}
              onSetTimesheets={onSetTimesheets}
              field="mon"
              rowKey="timeOut"
              theDate={getDayWithSpecificDate(2, dateFr)}
            />
          </TableCell>
          <TableCell>
            <TimeInput
              timeInput={activeTimesheet[0]!.timeOut}
              activeTimesheet={activeTimesheet[0]}
              onSetTimesheets={onSetTimesheets}
              field="tue"
              rowKey="timeOut"
              theDate={getDayWithSpecificDate(3, dateFr)}
            />
          </TableCell>
          <TableCell>
            <TimeInput
              timeInput={activeTimesheet[0]!.timeOut}
              activeTimesheet={activeTimesheet[0]}
              onSetTimesheets={onSetTimesheets}
              field="wed"
              rowKey="timeOut"
              theDate={getDayWithSpecificDate(4, dateFr)}
            />
          </TableCell>
          <TableCell>
            <TimeInput
              timeInput={activeTimesheet[0]!.timeOut}
              activeTimesheet={activeTimesheet[0]}
              onSetTimesheets={onSetTimesheets}
              field="thu"
              rowKey="timeOut"
              theDate={getDayWithSpecificDate(5, dateFr)}
            />
          </TableCell>
          <TableCell>
            <TimeInput
              timeInput={activeTimesheet[0]!.timeOut}
              activeTimesheet={activeTimesheet[0]}
              onSetTimesheets={onSetTimesheets}
              field="fri"
              rowKey="timeOut"
              theDate={getDayWithSpecificDate(6, dateFr)}
            />
          </TableCell>
          <TableCell className="bg-slate-200/30 dark:bg-slate-700/30">
            <TimeInput
              timeInput={activeTimesheet[0]!.timeOut}
              activeTimesheet={activeTimesheet[0]}
              onSetTimesheets={onSetTimesheets}
              field="sat"
              rowKey="timeOut"
              theDate={getDayWithSpecificDate(7, dateFr)}
            />
          </TableCell>
        </TableRow>
      </TableBody>
      <TableFooter className="border-t-slate-200 dark:border-t-slate-700">
        <TableRow className="border-t-slate-200 dark:border-t-slate-700">
          <TableCell>Total</TableCell>
          <TableCell className="bg-slate-200/30 text-center dark:bg-slate-700/30">
            8.00
          </TableCell>
          <TableCell className="text-center">8.00</TableCell>
          <TableCell className="text-center">8.00</TableCell>
          <TableCell className="text-center">8.00</TableCell>
          <TableCell className="text-center">8.00</TableCell>
          <TableCell className="text-center">8.00</TableCell>
          <TableCell className="bg-slate-200/30 text-center dark:bg-slate-700/30">
            8.00
          </TableCell>
          <TableCell className="text-center">52.00</TableCell>
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
