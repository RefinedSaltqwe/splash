"use server";

import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-actions";

import { authOptions } from "@/server/auth";
import { db } from "@/server/db";
import { getServerSession } from "next-auth";
import { DeleteSuppliers } from "./schema";
import { type InputType, type ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const session = await getServerSession(authOptions);

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
