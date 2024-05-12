"use server";
import { createSafeAction } from "@/lib/create-safe-actions";
import { deleteTagQuery, saveActivityLogsNotification } from "@/server/queries";
import { currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { DeleteTag } from "./schema";
import { type InputType, type ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { subaccountId, id, pipelineId } = data;
  try {
    const session = await currentUser();

    if (!session) {
      throw new Error("Unauthorized: You must be logged in.");
    }

    const response = await deleteTagQuery(id);

    if (!response) {
      throw new Error("Error deleting lane.");
    }
    await saveActivityLogsNotification({
      agencyId: undefined,
      description: `Deleted a tag | ${response?.name}`,
      subaccountId,
    });
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
  return { data: { id } };
};

export const deleteTag = createSafeAction(DeleteTag, handler);
