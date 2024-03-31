"use server";
import { createSafeAction } from "@/lib/create-safe-actions";
import { db } from "@/server/db";
import { currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { CreateTimesheet } from "./schema";
import { type InputType, type ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const session = await currentUser();

  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  const { dateFr, dateTo, agencyId } = data;

  let promiseAll;

  try {
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
        userId: string;
        dateFr: Date;
        dateTo: Date;
        agencyId: string;
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
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        error: err.message,
      };
    }
  }

  revalidatePath(`/admin/${agencyId}/team/time-sheet`);
  return { data: promiseAll };
};

export const createTimesheet = createSafeAction(CreateTimesheet, handler);
