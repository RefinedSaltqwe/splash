"use server";
import { createSafeAction } from "@/lib/create-safe-actions";
import { db } from "@/server/db";
import { currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { DeleteInventoryItems } from "./schema";
import { type InputType, type ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { ids, agencyId, subaccountId } = data;
  let deleteServices;
  try {
    const session = await currentUser();

    if (!session) {
      throw new Error("Unauthorized: You must be logged in.");
    }

    deleteServices = await db.inventory.deleteMany({
      where: {
        id: {
          in: ids,
        },
        agencyId,
        subaccountId,
      },
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

  revalidatePath(`/subaccount/${subaccountId}/inventory`, "page");
  return { data: { count: deleteServices.count } };
};

export const deleteInventoryItems = createSafeAction(
  DeleteInventoryItems,
  handler,
);
