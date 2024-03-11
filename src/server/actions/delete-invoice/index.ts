"use server";
import { createSafeAction } from "@/lib/create-safe-actions";
import { db } from "@/server/db";
import { currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { DeleteInvoice } from "./schema";
import { type InputType, type ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const session = await currentUser();

  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  const { id } = data;

  let deleteUsers;
  try {
    deleteUsers = await db.invoice.deleteMany({
      where: {
        id: {
          in: id,
        },
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        error: err.message,
      };
    }
    return {
      error: "Error deleting",
    };
  }

  revalidatePath(`/admin/invoice`);
  return { data: { count: deleteUsers.count } };
};

export const deleteInvoice = createSafeAction(DeleteInvoice, handler);
