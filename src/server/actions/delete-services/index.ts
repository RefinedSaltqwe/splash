"use server";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-actions";
import { DeleteService } from "./schema";
import { type InputType, type ReturnType } from "./types";
import { db } from "@/server/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";

const handler = async (data: InputType): Promise<ReturnType> => {
  const session = await getServerSession(authOptions);

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
  } catch (error) {
    return {
      error: "Failed to create.",
    };
  }

  revalidatePath(`/admin/services`);
  return { data: { count: deleteServices.count } };
};

export const deleteService = createSafeAction(DeleteService, handler);
