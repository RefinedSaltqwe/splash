"use server";
import { Prisma } from "@prisma/client";
import { sendVerificationEmail } from "./mail";
import { generateVerificationToken } from "./tokens";

export const confirmationEmail = async (email: string) => {
  const verificationToken = await generateVerificationToken(email);

  try {
    if (!verificationToken) {
      console.log("Failed to create token");
      throw new Error("Failed to create token");
    } else {
      await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token,
      );
      return verificationToken;
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
