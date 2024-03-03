"use server";

import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-actions";

import {
  saveActivityLogsNotification,
  sendEmailInvitation,
} from "@/server/queries";
import { SendInvitation } from "./schema";
import { type InputType, type ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { agencyId, email, role } = data;
  let promiseAll;
  try {
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
