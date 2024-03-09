"use server";
import { createSafeAction } from "@/lib/create-safe-actions";
import {
  deleteMediaQuery,
  saveActivityLogsNotification,
} from "@/server/queries";
import { currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { DeleteMedia } from "./schema";
import { type InputType, type ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const session = await currentUser();

  if (!session) {
    return {
      error: "Unauthorized",
    };
  }
  const { id, subaccountId } = data;
  let deleteMedia;
  try {
    const response = await deleteMediaQuery(id);
    await saveActivityLogsNotification({
      agencyId: undefined,
      description: `Deleted a media file | ${response?.name}`,
      subaccountId: response.subAccountId,
    });
    deleteMedia = response;
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

  revalidatePath(`/subaccount/${subaccountId}/media`);
  return { data: deleteMedia };
};

export const deleteMedia = createSafeAction(DeleteMedia, handler);
