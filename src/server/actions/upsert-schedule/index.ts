"use server";
import { createSafeAction } from "@/lib/create-safe-actions";
import {
  saveActivityLogsNotification,
  upsertScheduleQuery,
} from "@/server/queries";
import { currentUser } from "@clerk/nextjs";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { UpsertSchedule } from "./schema";
import { type InputType, type ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const session = await currentUser();

  if (!session) {
    return {
      error: "Unauthorized",
    };
  }
  const { id, start, end, allDay, title, description, userId, agencyId } = data;
  console.log({ data, id });
  let response;
  try {
    response = await upsertScheduleQuery({
      id: id ?? randomUUID(),
      start: start ?? "",
      end: end ?? "",
      allDay: allDay ?? true,
      title: title ?? "Not assigned",
      description,
      userId: userId ?? "",
      agencyId: agencyId ?? "",
    });
    await saveActivityLogsNotification({
      agencyId,
      description: `Updated a schedule | ${response?.title}`,
      subaccountId: "",
    });

    if (!response) {
      throw new Error("Error adding tag");
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        error: err.message,
      };
    }
  }

  revalidatePath(`/admin/${agencyId}/team/labor-tracking`, "page");
  return { data: response };
};

export const upsertSchedule = createSafeAction(UpsertSchedule, handler);
