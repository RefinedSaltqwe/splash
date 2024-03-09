"use server";
import { createSafeAction } from "@/lib/create-safe-actions";
import { saveActivityLogsNotification, upsertTicket } from "@/server/queries";
import { currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { CreateTicket } from "./schema";
import { type InputType, type ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const session = await currentUser();

  if (!session) {
    return {
      error: "Unauthorized",
    };
  }
  const { tags, subAccountId, ticketId, ...rest } = data;
  let response;
  try {
    response = await upsertTicket(
      {
        id: ticketId,
        ...rest,
      },
      tags,
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

  revalidatePath(`/subaccount/${subAccountId}/pipelines`);
  return { data: response };
};

export const createTicket = createSafeAction(CreateTicket, handler);
