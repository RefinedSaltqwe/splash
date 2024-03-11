"use server";
import { createSafeAction } from "@/lib/create-safe-actions";
import { db } from "@/server/db";
import { currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { DeleteService } from "./schema";
import { type InputType, type ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const session = await currentUser();

  if (!session) {
    return {
      error: "Unauthorized",
    };
  }
  const { ids } = data;
  let deleteServices;
  try {
    deleteServices = await db.serviceType.deleteMany({
      where: {
        id: {
          in: ids,
        },
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

  revalidatePath(`/admin/services`);
  return { data: { count: deleteServices.count } };
};

export const deleteService = createSafeAction(DeleteService, handler);
