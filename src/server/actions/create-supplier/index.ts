"use server";

import { createSafeAction } from "@/lib/create-safe-actions";
import { db } from "@/server/db";
import { currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { CreateSupplier } from "./schema";
import { type InputType, type ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const session = await currentUser();

  if (!session) {
    return {
      error: "Unauthorized",
    };
  }
  const { name, companyName, email, address, phoneNumber, agencyId } = data;
  let newSupplier;
  try {
    newSupplier = await db.supplier.create({
      data: {
        name,
        companyName: companyName ? companyName : "N/A",
        address,
        email,
        phoneNumber,
        agencyId,
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        error: err.message,
      };
    }
  }

  revalidatePath(`/admin/${agencyId}/suppliers`, "page");
  return { data: newSupplier };
};

export const createSupplier = createSafeAction(CreateSupplier, handler);
