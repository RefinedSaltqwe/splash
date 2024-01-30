"use server";
import { Prisma } from "@prisma/client";
import { sendTwoFactorEmail } from "./mail";
import { generateTwoFactorToken } from "./tokens";

export const twoFactorEmail = async (email: string) => {
  const twoFactorToken = await generateTwoFactorToken(email);

  try {
    if (!twoFactorToken) {
      console.log("Failed to create token");
      throw new Error("Failed to create two factor token");
    } else {
      await sendTwoFactorEmail(twoFactorToken.email, twoFactorToken.token);
      return twoFactorToken;
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
