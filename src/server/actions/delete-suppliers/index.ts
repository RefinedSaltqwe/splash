"use server";

import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-actions";

import { db } from "@/server/db";
import { currentUser } from "@clerk/nextjs";
import { DeleteSuppliers } from "./schema";
import { type InputType, type ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const session = await currentUser();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const { ids } = data;

  let count;

  try {
    count = await db.supplier.deleteMany({
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
  }

  revalidatePath(`/admin/suppliers`);
  return { data: { count: count?.count } };
};

export const deleteSuppliers = createSafeAction(DeleteSuppliers, handler);
