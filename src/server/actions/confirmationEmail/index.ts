"use server";

import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-actions";

import { db } from "@/server/db";
import { getUserByEmail, getVerificationTokenByToken } from "../fetch";
import { ConfirmEmail } from "./schema";
import { type InputType, type ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { token } = data;

  let user;
  try {
    const existingToken = await getVerificationTokenByToken(token);
    if (!existingToken) {
      throw new Error("Token does not exist!");
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
      throw new Error("Token has expired!");
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
      throw new Error("Email does not exist!");
    }

    const userUpdate = db.user.update({
      where: { id: existingUser.id },
      data: {
        emailVerified: new Date(),
        email: existingToken.email,
        status: "Active",
      },
    });

    const removeToken = db.verificationToken.delete({
      where: { id: existingToken.id },
    });

    const [userPromise, tokenPromise] = await Promise.all([
      userUpdate,
      removeToken,
    ]);
    if (userPromise && tokenPromise) {
      user = userPromise;
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        error: err.message,
      };
    }
  }

  revalidatePath(`/admin/auth/registration`);
  return { data: user };
};

export const confirmEmail = createSafeAction(ConfirmEmail, handler);
