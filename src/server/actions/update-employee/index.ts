"use server";

import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-actions";

import { db } from "@/server/db";
import { UpdateEmployee } from "./schema";
import { type InputType, type ReturnType } from "./types";
import { clerkClient } from "@clerk/nextjs";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id, ...user } = data;
  let promiseAll;
  try {
    const updateEmployee = await db.user.update({
      where: {
        id,
      },
      data: {
        ...user,
        name: `${user.firstName} ${user.lastName}`,
      },
    });

    if (!updateEmployee) {
      throw new Error("Failed to update employee");
    }
    await clerkClient.users.updateUserMetadata(updateEmployee.id, {
      privateMetadata: {
        role: updateEmployee.role || "SUBACCOUNT_USER",
      },
    });
    promiseAll = {
      ...updateEmployee,
    };
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        error: err.message,
      };
    }
  }

  revalidatePath(`/admin/${promiseAll?.agencyId}/employees/list`);
  return { data: promiseAll };
};

export const updateEmployee = createSafeAction(UpdateEmployee, handler);
