"use server";
import { createSafeAction } from "@/lib/create-safe-actions";
import { db } from "@/server/db";
import { currentUser } from "@clerk/nextjs";
import {
  type BreakIn,
  type BreakOut,
  type TimeIn,
  type TimeOut,
  type TimeTotal,
  type Timesheet,
} from "@prisma/client";
import { revalidatePath } from "next/cache";
import { UpdateTimesheets } from "./schema";
import { type InputType, type ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const session = await currentUser();

  if (!session) {
    return {
      error: "Unauthorized: you must be logged in.",
    };
  }

  const { timesheets, status } = data;

  //Get Timesheet IDs
  const ids: string[] = [];
  timesheets.forEach((timesheet) => ids.push(timesheet!.id));
  // Dissection
  // Get timesheets
  const timesheetsOnly: Timesheet[] = [];
  //Get Time Inputs
  const timeIns: TimeIn[] = [];
  const breakOuts: BreakOut[] = [];
  const breakIns: BreakIn[] = [];
  const timeOuts: TimeOut[] = [];
  const timeTotals: TimeTotal[] = [];

  timesheets.forEach((timesheet) => {
    timesheetsOnly.push({
      agencyId: timesheet!.agencyId,
      id: timesheet!.id,
      groupId: timesheet!.groupId,
      dateCreated: timesheet!.dateCreated,
      status,
      userId: timesheet!.userId,
      dateFr: timesheet!.dateFr,
      dateTo: timesheet!.dateTo,
    });
    timeIns.push(timesheet!.timeIn!);
    breakOuts.push(timesheet!.breakOut!);
    breakIns.push(timesheet!.breakIn!);
    timeOuts.push(timesheet!.timeOut!);
    timeTotals.push(timesheet!.timeTotal!);
  });

  let promiseAll;

  try {
    const [timesheet, timeIn, timeOut, breakIn, breakOut, timeTotal] =
      await db.$transaction([
        db.timesheet.deleteMany({
          where: {
            id: {
              in: ids,
            },
          },
        }),
        db.timesheet.createMany({
          data: timesheetsOnly,
          skipDuplicates: true,
        }),
        db.timeIn.createMany({
          data: timeIns,
          skipDuplicates: true,
        }),
        db.timeOut.createMany({
          data: timeOuts,
          skipDuplicates: true,
        }),
        db.breakIn.createMany({
          data: breakIns,
          skipDuplicates: true,
        }),
        db.breakOut.createMany({
          data: breakOuts,
          skipDuplicates: true,
        }),
        db.timeTotal.createMany({
          data: timeTotals,
          skipDuplicates: true,
        }),
      ]);
    if (timesheet) {
      promiseAll = {
        status,
        count: timesheet.count,
        dateFr: timesheets[0]!.dateFr,
        dateTo: timesheets[0]!.dateTo,
      };
    } else {
      throw new Error("Creating timesheet failed.");
    }
    if (!timeIn || !timeOut || !breakIn || !breakOut || !timeTotal) {
      throw new Error("One of the time inputs failed.");
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        error: err.message,
      };
    }
  }

  revalidatePath(`/admin/${timesheets[0]?.agencyId}/team/time-sheet`);
  return { data: promiseAll };
};

export const updateTimesheets = createSafeAction(UpdateTimesheets, handler);
