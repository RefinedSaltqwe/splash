"use server";

import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-actions";

import { authOptions } from "@/server/auth";
import { db } from "@/server/db";
import { getServerSession } from "next-auth";
import { CreateCustomer } from "./schema";
import { type InputType, type ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return {
      error: "Unauthorized",
    };
  }
  const { name, companyName, email, address, phoneNumber } = data;
  let newCustomer;
  try {
    newCustomer = await db.customer.create({
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

  revalidatePath(`/admin/customers/create`);
  return { data: newCustomer };
};

export const createCustomer = createSafeAction(CreateCustomer, handler);
