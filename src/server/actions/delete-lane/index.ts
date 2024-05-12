"use server";
import { createSafeAction } from "@/lib/create-safe-actions";
import { currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { DeleteLane } from "./schema";
import { type InputType, type ReturnType } from "./types";
import {
  deleteLaneQuery,
  saveActivityLogsNotification,
} from "@/server/queries";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { pipelineId, subaccountId, laneId } = data;
  let deleteLanePromise;
  try {
    const session = await currentUser();

    if (!session) {
      throw new Error("Unauthorized: You must be logged in.");
    }

    const response = await deleteLaneQuery(laneId);

    if (!response) {
      throw new Error("Error deleting lane.");
    }
    await saveActivityLogsNotification({
      agencyId: undefined,
      description: `Deleted a lane | ${response?.name}`,
      subaccountId,
    });

    deleteLanePromise = response;
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

  revalidatePath(`/subaccount/${subaccountId}/pipelines/${pipelineId}`);
  return { data: deleteLanePromise };
};

export const deleteLane = createSafeAction(DeleteLane, handler);
