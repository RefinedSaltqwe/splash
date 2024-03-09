"use server";
import { createSafeAction } from "@/lib/create-safe-actions";
import { saveActivityLogsNotification, upsertTag } from "@/server/queries";
import { currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { CreateTag } from "./schema";
import { type InputType, type ReturnType } from "./types";
import { randomUUID } from "crypto";

const handler = async (data: InputType): Promise<ReturnType> => {
  const session = await currentUser();

  if (!session) {
    return {
      error: "Unauthorized",
    };
  }
  const { subAccountId } = data;
  let reponse;
  try {
    reponse = await upsertTag(subAccountId, { ...data, id: randomUUID() });

    await saveActivityLogsNotification({
      agencyId: undefined,
      description: `Updated a tag | ${reponse?.name}`,
      subaccountId: subAccountId,
    });

    if (!reponse) {
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
  return { data: reponse };
};

export const createTag = createSafeAction(CreateTag, handler);
