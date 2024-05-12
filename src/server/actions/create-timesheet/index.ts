"use server";
import { createSafeAction } from "@/lib/create-safe-actions";
import { db } from "@/server/db";
import { currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { CreateTimesheet } from "./schema";
import { type InputType, type ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { dateFr, dateTo, agencyId } = data;

  let promiseAll;

  try {
    const session = await currentUser();

    if (!session) {
      throw new Error("Unauthorized: You must be logged in.");
    }

    const getUsers = await db.user.findMany({
      where: {
        agencyId,
        NOT: {
          OR: [
            {
              role: "SUPER_ADMIN",
            },
            {
              role: "AGENCY_OWNER",
            },
          ],
        },
      },
      select: {
        id: true,
      },
    });

    if (getUsers) {
      const constructedDataForTimesheet: {
        id: string;
        groupId: string;
        userId: string;
        dateFr: string;
        dateTo: string;
        agencyId: string;
      }[] = [];
      const constructedDataForTimeInputs: { timesheetId: string }[] = [];

      const date = dateFr.split(" ");

      getUsers.forEach((user) => {
        const generatedId = `${user.id}${date[1]}${date[2]}${date[3]}`;
        const groupId = `ts_${date[1]}${date[2]}${date[3]}`;
        constructedDataForTimesheet.push({
          id: generatedId,
          userId: user.id,
          groupId,
          dateFr,
          dateTo,
          agencyId,
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
    } else {
      throw new Error("no-other-users");
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        error: err.message,
      };
    }
  }

  revalidatePath(`/admin/${agencyId}/team/time-sheet`, "page");
  return { data: promiseAll };
};

export const createTimesheet = createSafeAction(CreateTimesheet, handler);
