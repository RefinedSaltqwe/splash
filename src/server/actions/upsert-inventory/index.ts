"use server";
import { createSafeAction } from "@/lib/create-safe-actions";
import {
  saveActivityLogsNotification,
  upsertInventoryQuery,
} from "@/server/queries";
import { currentUser } from "@clerk/nextjs";
import { UpsertInventory } from "./schema";
import { type InputType, type ReturnType } from "./types";
import { revalidatePath } from "next/cache";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { subaccountId, ...values } = data;
  let response;
  try {
    const session = await currentUser();

    if (!session) {
      throw new Error("Unauthorized: You must be logged in.");
    }

    response = await upsertInventoryQuery({
      ...values,
      subaccountId: subaccountId ?? "",
      agencyId: values.agencyId ?? "",
    });

    await saveActivityLogsNotification({
      agencyId: undefined,
      description: `Created or updated an inventory item | ${response?.name}`,
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

  revalidatePath(`/subaccount/${subaccountId}/inventory`, "page");
  return { data: response };
};

export const upsertInventory = createSafeAction(UpsertInventory, handler);
