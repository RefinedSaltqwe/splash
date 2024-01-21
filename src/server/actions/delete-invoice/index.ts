"use server";
import { createSafeAction } from "@/lib/create-safe-actions";
import { authOptions } from "@/server/auth";
import { db } from "@/server/db";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { DeleteInvoice } from "./schema";
import { type InputType, type ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  const { id } = data;

  console.log("dasdasdasasdad: ", id);

  let deleteUsers;
  try {
    deleteUsers = await db.invoice.deleteMany({
      where: {
        id: {
          in: id,
        },
      },
    });
  } catch (err) {
    return {
      error: `Failed to create: ${!err}`,
    };
  }

  revalidatePath(`/admin/invoice`);
  return { data: { count: deleteUsers.count } };
};

export const deleteInvoice = createSafeAction(DeleteInvoice, handler);
