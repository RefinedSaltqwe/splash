import { type TimesheetRowKey, type TimesheetField } from "@/types";

export const customerDefaultValues = {
  name: "",
  companyName: "",
  address: "",
  email: "",
  phoneNumber: "",
};

export const rowKeys: TimesheetRowKey[] = [
  "timeIn",
  "breakOut",
  "breakIn",
  "timeOut",
];
export const fields: TimesheetField[] = [
  "sun",
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
];

export const rowName = {
  timeIn: "Time-in",
  breakOut: "Break-out",
  breakIn: "Break-in",
  timeOut: "Time-out",
};
