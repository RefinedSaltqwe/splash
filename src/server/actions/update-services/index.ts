"use server";
import { createSafeAction } from "@/lib/create-safe-actions";
import { db } from "@/server/db";
import { currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { UpdateService } from "./schema";
import { type InputType, type ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const session = await currentUser();

  if (!session) {
    return {
      error: "Unauthorized",
    };
  }
  const { id, name } = data;
  let updatedService;
  try {
    updatedService = await db.serviceType.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        error: err.message,
      };
    }
  }

  revalidatePath(`/admin/services`);
  return { data: updatedService };
};

export const updateService = createSafeAction(UpdateService, handler);
