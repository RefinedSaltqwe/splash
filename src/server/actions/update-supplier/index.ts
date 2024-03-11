"use server";

import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-actions";

import { db } from "@/server/db";
import { currentUser } from "@clerk/nextjs";
import { UpdateSupplier } from "./schema";
import { type InputType, type ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const session = await currentUser();

  if (!session) {
    return {
      error: "Unauthorized",
    };
  }
  const { id, name, companyName, email, address, phoneNumber } = data;
  let updatedSupplier;
  try {
    updatedSupplier = await db.supplier.update({
      where: {
        id: id,
      },
      data: {
        name,
        companyName,
        address,
        email,
        phoneNumber,
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        error: err.message,
      };
    }
  }

  revalidatePath(`/admin/suppliers/update/${id}`);
  return { data: updatedSupplier };
};

export const updateSupplier = createSafeAction(UpdateSupplier, handler);
