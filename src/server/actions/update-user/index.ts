"use server";

import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-actions";

import { clerkClient, currentUser } from "@clerk/nextjs";
import { UpdateUser } from "./schema";
import { type InputType, type ReturnType } from "./types";
import { db } from "@/server/db";

const handler = async (data: InputType): Promise<ReturnType> => {
  const authUser = await currentUser();

  if (!authUser) {
    throw new Error("Unauthorized: You must be logged in.");
  }

  const { id, ...rest } = data;
  let updatedUser;
  try {
    const response = await db.user.update({
      where: { email: rest.email },
      data: { ...data },
    });

    await clerkClient.users.updateUserMetadata(response.id, {
      privateMetadata: {
        role: rest.role ?? "SUBACCOUNT_USER",
      },
    });

    if (response) {
      updatedUser = response;
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        error: err.message,
      };
    }
  }

  revalidatePath(`/admin/${id}/settings`);
  return { data: updatedUser };
};

export const updateUser = createSafeAction(UpdateUser, handler);
