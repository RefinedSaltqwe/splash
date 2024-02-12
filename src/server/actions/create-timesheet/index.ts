"use server";
import { createSafeAction } from "@/lib/create-safe-actions";
import { authOptions } from "@/server/auth";
import { db } from "@/server/db";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { CreateTimesheet } from "./schema";
import { type InputType, type ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  const { dateFr, dateTo } = data;

  let promiseAll;

  try {
    const getUsers = await db.user.findMany({
      where: {
        role: {
          not: "super-admin",
        },
      },
      select: {
        id: true,
      },
    });
    if (getUsers) {
      const constructedDataForTimesheet: {
        id: string;
        userId: string;
        dateFr: Date;
        dateTo: Date;
      }[] = [];
      const constructedDataForTimeInputs: { timesheetId: string }[] = [];

      getUsers.forEach((user) => {
        const generatedId = `${user.id}${dateFr
          .toLocaleDateString()
          .split("-")
          .join("")}`;
        constructedDataForTimesheet.push({
          id: generatedId,
          userId: user.id,
          dateFr,
          dateTo,
        });
        constructedDataForTimeInputs.push({
          timesheetId: generatedId,
        });
      });

      const [timesheet, timeIn, timeOut, breakIn, breakOut, timeTotal] =
        await db.$transaction([
          db.timesheet.createMany({
            data: constructedDataForTimesheet,
            skipDuplicates: true,
          }),
          db.timeIn.createMany({
            data: constructedDataForTimeInputs,
            skipDuplicates: true,
          }),
          db.timeOut.createMany({
            data: constructedDataForTimeInputs,
            skipDuplicates: true,
          }),
          db.breakIn.createMany({
            data: constructedDataForTimeInputs,
            skipDuplicates: true,
          }),
          db.breakOut.createMany({
            data: constructedDataForTimeInputs,
            skipDuplicates: true,
          }),
          db.timeTotal.createMany({
            data: constructedDataForTimeInputs,
            skipDuplicates: true,
          }),
        ]);

      if (timesheet) {
        promiseAll = { count: timesheet.count, ...data };
      } else {
        throw new Error("Creating timesheet failed.");
      }

      if (!timeIn || !timeOut || !breakIn || !breakOut || !timeTotal) {
        throw new Error("One of the time inputs failed.");
      }
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        error: err.message,
      };
    }
  }

  revalidatePath(`/admin/employees/time-sheet`);
  return { data: promiseAll };
};

export const createTimesheet = createSafeAction(CreateTimesheet, handler);
