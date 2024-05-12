"use server";

import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-actions";

import { db } from "@/server/db";
import { currentUser } from "@clerk/nextjs";
import { CreateCustomer } from "./schema";
import { type InputType, type ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { name, companyName, email, address, phoneNumber, agencyId } = data;
  let newCustomer;
  try {
    const session = await currentUser();

    if (!session) {
      throw new Error("Unauthorized: You must be logged in.");
    }

    newCustomer = await db.customer.create({
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

  revalidatePath(`/admin/${agencyId}/customers/create`);
  return { data: newCustomer };
};

export const createCustomer = createSafeAction(CreateCustomer, handler);
