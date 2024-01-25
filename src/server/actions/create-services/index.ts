"use server";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-actions";
import { CreateService } from "./schema";
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
  const { name } = data;
  let newService;
  try {
    newService = await db.serviceType.create({
      data: {
        name,
      },
    });
  } catch (error) {
    return {
      error: "Failed to create.",
    };
  }

  revalidatePath(`/admin/services`);
  return { data: newService };
};

export const createService = createSafeAction(CreateService, handler);
