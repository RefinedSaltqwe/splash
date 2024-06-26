"use server";
import { createSafeAction } from "@/lib/create-safe-actions";
import {
  saveActivityLogsNotification,
  upsertContactQuery,
} from "@/server/queries";
import { currentUser } from "@clerk/nextjs";
import { UpsertContact } from "./schema";
import { type InputType, type ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { subaccountId, ...values } = data;
  let response;
  try {
    const session = await currentUser();

    if (!session) {
      throw new Error("Unauthorized: You must be logged in.");
    }

    response = await upsertContactQuery({
      ...values,
      subAccountId: subaccountId!,
    });
    //WIP Call trigger endpoint
    await saveActivityLogsNotification({
      agencyId: undefined,
      description: `A New contact signed up | ${response?.name}`,
      subaccountId: subaccountId,
    });

    if (!response) {
      throw new Error("Error: could not save information");
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        error: err.message,
      };
    }
  }

  return { data: response };
};

export const upsertContact = createSafeAction(UpsertContact, handler);
