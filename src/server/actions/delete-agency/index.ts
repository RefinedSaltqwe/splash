"use server";

import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-actions";

import { currentUser } from "@clerk/nextjs";
import { DeleteAgency } from "./schema";
import { type InputType, type ReturnType } from "./types";
import { db } from "@/server/db";

const handler = async (data: InputType): Promise<ReturnType> => {
  const authUser = await currentUser();

  if (!authUser) {
    throw new Error("Unauthorized");
  }

  const { id } = data;
  let response;

  try {
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
