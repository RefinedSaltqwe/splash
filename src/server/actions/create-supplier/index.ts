"use server";

import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-actions";
import { authOptions } from "@/server/auth";
import { db } from "@/server/db";
import { getServerSession } from "next-auth";
import { CreateSupplier } from "./schema";
import { type InputType, type ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return {
      error: "Unauthorized",
    };
  }
  const { name, companyName, email, address, phoneNumber } = data;
  let newSupplier;
  try {
    newSupplier = await db.supplier.create({
      data: {
        name,
        companyName: companyName ? companyName : "N/A",
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

  revalidatePath(`/admin/suppliers/create`);
  return { data: newSupplier };
};

export const createSupplier = createSafeAction(CreateSupplier, handler);
