"use server";

import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-actions";

import { saveActivityLogsNotification, upsertFunnel } from "@/server/queries";
import { randomUUID } from "crypto";
import { CreateFunnel } from "./schema";
import { type InputType, type ReturnType } from "./types";
import { currentUser } from "@clerk/nextjs";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { subAccountId, defaultLiveProducts, defaultId, ...values } = data;
  let promiseAll;
  try {
    const session = await currentUser();

    if (!session) {
      throw new Error("Unauthorized: You must be logged in.");
    }

    const response = await upsertFunnel(
      subAccountId!,
      { ...values, liveProducts: defaultLiveProducts ?? "[]" },
      defaultId ?? randomUUID(),
    );
    if (!response) {
      throw new Error("Failed: could not save funnel details.");
    }
    await saveActivityLogsNotification({
      agencyId: undefined,
      description: `Update funnel | ${response.name}`,
      subaccountId: subAccountId,
    });
    promiseAll = response;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        error: err.message,
      };
    }
  }

  revalidatePath(`/subaccount/${subAccountId}/funnels`, "page");
  return { data: promiseAll };
};

export const createFunnel = createSafeAction(CreateFunnel, handler);
