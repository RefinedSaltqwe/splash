import {
  type Timesheet,
  type Invoice,
  type Service,
  type TimeIn,
  type TimeOut,
  type BreakIn,
  type BreakOut,
  type TimeTotal,
} from "@prisma/client";

export type InvoiceWithService = Invoice & { services: Service[] };
export type TimesheetWithInputTimes =
  | (Timesheet & {
      timeIn: TimeIn | null;
      timeOut: TimeOut | null;
      breakIn: BreakIn | null;
      breakOut: BreakOut | null;
      timeTotal: TimeTotal | null;
    })
  | null
  | undefined;
