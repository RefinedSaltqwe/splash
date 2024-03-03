"use server";

import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-actions";

import { db } from "@/server/db";
import {
  getSubaccountDetails,
  saveActivityLogsNotification,
} from "@/server/queries";
import { currentUser } from "@clerk/nextjs";
import { DeleteSubaccount } from "./schema";
import { type InputType, type ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const session = await currentUser();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const { subaccountId } = data;
  let response;

  try {
    response = await getSubaccountDetails(subaccountId);
    await saveActivityLogsNotification({
      agencyId: undefined,
      description: `Deleted a subaccount | ${response?.name}`,
      subaccountId,
    });
    const deleteSubaccount = await db.subAccount.delete({
      where: {
        id: subaccountId,
      },
    });

    if (!deleteSubaccount) {
      throw new Error("Deleting error.");
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        error: err.message,
      };
    }
  }

  revalidatePath(`/admin/${response?.agencyId}`);
  return { data: response };
};

export const deleteSubaccount = createSafeAction(DeleteSubaccount, handler);
