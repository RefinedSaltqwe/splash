"use server";
import { createSafeAction } from "@/lib/create-safe-actions";
import { db } from "@/server/db";
import { currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { CreatePayment } from "./schema";
import { type InputType, type ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { value, invoiceId, agencyId } = data;
  let newService;
  try {
    const session = await currentUser();

    if (!session) {
      throw new Error("Unauthorized: You must be logged in.");
    }

    newService = await db.payment.create({
      data: {
        agencyId,
        value,
        invoiceId,
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        error: err.message,
      };
    }
  }

  revalidatePath(`/admin/${agencyId}/transactions/invoice`, "page");
  return { data: newService };
};

export const createPayment = createSafeAction(CreatePayment, handler);
