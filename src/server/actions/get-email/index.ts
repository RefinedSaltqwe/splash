"use server";

import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-actions";

import { db } from "@/server/db";
import { Prisma } from "@prisma/client";
import { GetEmail } from "./schema";
import { type InputType, type ReturnType } from "./types";
import { currentUser } from "@clerk/nextjs";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { email } = data;

  let emailExist;
  try {
    const session = await currentUser();

    if (!session) {
      throw new Error("Unauthorized: You must be logged in.");
    }

    emailExist = await db.authorizedEmail.findUnique({
      where: {
        email,
      },
    });
    if (!emailExist) {
      throw new Error("Email does not exist");
    }
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientInitializationError ||
      error instanceof Prisma.PrismaClientKnownRequestError
    ) {
      throw new Error("System error. There is an error fetching token.");
    }
    return { data: { id: "", email: "notexist", registered: false } };
  }

  revalidatePath(`/admin/auth/registration`);
  return { data: emailExist };
};

export const getEmail = createSafeAction(GetEmail, handler);
