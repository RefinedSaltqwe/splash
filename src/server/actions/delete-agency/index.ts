"use server";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-actions";
import { currentUser } from "@clerk/nextjs";
import { DeleteAgency } from "./schema";
import { type InputType, type ReturnType } from "./types";
import { db } from "@/server/db";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id } = data;
  let response;

  try {
    const session = await currentUser();

    if (!session) {
      throw new Error("Unauthorized: You must be logged in.");
    }

    response = await db.agency.delete({ where: { id } });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        error: err.message,
      };
    }
  }

  revalidatePath(`/admin`);
  return { data: response };
};

export const deleteAgency = createSafeAction(DeleteAgency, handler);
