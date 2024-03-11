"use server";

import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-actions";

import { db } from "@/server/db";
import { currentUser } from "@clerk/nextjs";
import { DeleteCustomer } from "./schema";
import { type InputType, type ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const session = await currentUser();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const { id } = data;
  let customer;

  try {
    customer = await db.customer.delete({
      where: {
        id,
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        error: err.message,
      };
    }
  }

  revalidatePath(`/admin/customers`);
  return { data: customer };
};

export const deleteCustomer = createSafeAction(DeleteCustomer, handler);
