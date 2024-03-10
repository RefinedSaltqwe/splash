"use server";
import { createSafeAction } from "@/lib/create-safe-actions";
import {
  deleteTicketQuery,
  saveActivityLogsNotification,
} from "@/server/queries";
import { currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { DeleteTicket } from "./schema";
import { type InputType, type ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const session = await currentUser();

  if (!session) {
    return {
      error: "Unauthorized",
    };
  }
  const { pipelineId, subaccountId, ticketId } = data;
  let deleteLanePromise;
  try {
    const response = await deleteTicketQuery(ticketId);

    if (!response) {
      throw new Error("Error deleting lane.");
    }
    await saveActivityLogsNotification({
      agencyId: undefined,
      description: `Deleted a ticket | ${response?.name}`,
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

export const deleteTicket = createSafeAction(DeleteTicket, handler);
