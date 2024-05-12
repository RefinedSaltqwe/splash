"use server";

import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-actions";

import {
  saveActivityLogsNotification,
  sendEmailInvitation,
} from "@/server/queries";
import { SendInvitation } from "./schema";
import { type InputType, type ReturnType } from "./types";
import { currentUser } from "@clerk/nextjs";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { agencyId, email, role } = data;
  let promiseAll;
  try {
    const session = await currentUser();

    if (!session) {
      throw new Error("Unauthorized: You must be logged in.");
    }

    const res = await sendEmailInvitation(role, email, agencyId);
    await saveActivityLogsNotification({
      agencyId: agencyId,
      description: `Invited ${res.email}`,
      subaccountId: undefined,
    });
    promiseAll = res;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        error: err.message,
      };
    }
  }

  revalidatePath(`/admin/${agencyId}/team/list`);
  return { data: promiseAll };
};

export const sendInvitation = createSafeAction(SendInvitation, handler);
