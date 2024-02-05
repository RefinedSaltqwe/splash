"use server";
import { getUserByEmail } from "@/server/actions/fetch";
import { Prisma } from "@prisma/client";
import { sendVerificationEmail } from "./mail";
import { generateVerificationToken } from "./tokens";

export const confirmationEmail = async (email: string) => {
  const verificationToken = generateVerificationToken(email);
  const getUser = getUserByEmail(email);
  const [user, token] = await Promise.all([getUser, verificationToken]);
  const name = `${user?.name}`;

  try {
    if (!token) {
      throw new Error("Failed to create token");
    } else {
      await sendVerificationEmail(name, token.email, token.token);
      return token;
    }
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientInitializationError ||
      error instanceof Prisma.PrismaClientKnownRequestError
    ) {
      throw new Error("System error. There is an error fetching token.");
    }
    throw error;
  }
};
