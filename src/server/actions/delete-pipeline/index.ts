"use server";
import { createSafeAction } from "@/lib/create-safe-actions";
import {
  executeDeletePipeline,
  saveActivityLogsNotification,
} from "@/server/queries";
import { currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { DeletePipeline } from "./schema";
import { type InputType, type ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const session = await currentUser();

  if (!session) {
    return {
      error: "Unauthorized",
    };
  }
  const { pipelineId, subaccountId } = data;
  let deletePipeline;
  try {
    const response = await executeDeletePipeline(pipelineId);
    await saveActivityLogsNotification({
      agencyId: undefined,
      description: `Deleted a pipeline | ${response?.name}`,
      subaccountId: response.subAccountId,
    });
    if (!response) {
      throw new Error("Error deleting pipeline");
    }
    deletePipeline = response;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        error: err.message,
      };
    }
    return {
      error: "Error deleting",
    };
  }

  revalidatePath(`/subaccount/${subaccountId}/pipeline`);
  return { data: deletePipeline };
};

export const deletePipeline = createSafeAction(DeletePipeline, handler);
