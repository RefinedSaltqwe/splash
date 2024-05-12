"use server";

import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-actions";

import { saveActivityLogsNotification, upsertPipeline } from "@/server/queries";
import { CreatePipeline } from "./schema";
import { type InputType, type ReturnType } from "./types";
import { currentUser } from "@clerk/nextjs";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { name, pipelineId, subAccountId } = data;
  let promiseAll;
  try {
    const session = await currentUser();

    if (!session) {
      throw new Error("Unauthorized: You must be logged in.");
    }

    const response = await upsertPipeline({
      name,
      id: pipelineId,
      subAccountId: subAccountId,
    });

    await saveActivityLogsNotification({
      agencyId: undefined,
      description: `Updates a pipeline | ${response?.name}`,
      subaccountId: subAccountId,
    });
    if (!response) {
      throw new Error("Failed to create or update pipeline.");
    }
    promiseAll = response;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        error: err.message,
      };
    }
  }

  revalidatePath(`/subaccount/${subAccountId}/pipelines`, "page");
  return { data: promiseAll };
};

export const createPipeline = createSafeAction(CreatePipeline, handler);
