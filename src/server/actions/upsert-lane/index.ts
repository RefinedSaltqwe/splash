"use server";

import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-actions";

import {
  saveActivityLogsNotification,
  upsertLaneQuery,
} from "@/server/queries";
import { getPipelineDetails } from "../fetch";
import { UpsertLane } from "./schema";
import { type InputType, type ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { name, order, pipelineId, subAccountId, laneId } = data;
  let promiseAll;
  try {
    const response = await upsertLaneQuery(name, laneId, pipelineId, order);

    if (response) {
      promiseAll = response;
    }

    const d = await getPipelineDetails(pipelineId);
    if (!d) {
      throw new Error("Pipeline does not exist");
    }

    await saveActivityLogsNotification({
      agencyId: undefined,
      description: `Updated a lane | ${response?.name}`,
      subaccountId: d.subAccountId,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        error: err.message,
      };
    }
  }

  revalidatePath(`/subaccount/${subAccountId}/pipelines/${pipelineId}`);
  return { data: promiseAll };
};

export const upsertLane = createSafeAction(UpsertLane, handler);
