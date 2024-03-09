"use server";

import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-actions";

import { createMedia, saveActivityLogsNotification } from "@/server/queries";
import { currentUser } from "@clerk/nextjs";
import { UploadMedia } from "./schema";
import { type InputType, type ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const session = await currentUser();

  if (!session?.id) {
    return {
      error: "Unauthorized",
    };
  }
  const { subaccountId, ...values } = data;
  let response;
  try {
    response = await createMedia(subaccountId, values);
    await saveActivityLogsNotification({
      agencyId: undefined,
      description: `Uploaded a media file | ${response.name}`,
      subaccountId,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        error: err.message,
      };
    }
  }

  revalidatePath(`/subaccount/${subaccountId}/media`);
  return { data: response };
};

export const uploadMedia = createSafeAction(UploadMedia, handler);
