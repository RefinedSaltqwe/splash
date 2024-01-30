"use server";

import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-actions";

import { UpdateCustomer } from "./schema";
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
  const { id, name, companyName, email, address, phoneNumber } = data;
  let updatedCustomer;
  try {
    updatedCustomer = await db.customer.update({
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

  revalidatePath(`/admin/customers/update/${id}`);
  return { data: updatedCustomer };
};

export const updateCustomer = createSafeAction(UpdateCustomer, handler);
