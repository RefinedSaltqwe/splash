"use server";
import { createSafeAction } from "@/lib/create-safe-actions";
import {
  saveActivityLogsNotification,
  upsertTicketQuery,
} from "@/server/queries";
import { currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { UpsertTicket } from "./schema";
import { type InputType, type ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { materialsUsed, tags, subAccountId, ticketId, ...rest } = data;
  let response;
  try {
    const session = await currentUser();

    if (!session) {
      throw new Error("Unauthorized: You must be logged in.");
    }

    response = await upsertTicketQuery(
      {
        id: ticketId,
        customerId: rest.customerId === "" ? null : rest.customerId,
        assignedUserId: rest.assignedUserId === "" ? null : rest.assignedUserId,
        ...rest,
        value: parseFloat(rest.value),
      },
      tags,
      materialsUsed,
    );
    await saveActivityLogsNotification({
      agencyId: undefined,
      description: `Updated a ticket | ${response?.name}`,
      subaccountId: subAccountId,
    });

    if (!response) {
      throw new Error("Error adding tag");
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        error: err.message,
      };
    }
  }

  revalidatePath(
    `/subaccount/${subAccountId}/pipelines/${response?.Lane.pipelineId}`,
  );
  return { data: response };
};

export const upsertTicket = createSafeAction(UpsertTicket, handler);
