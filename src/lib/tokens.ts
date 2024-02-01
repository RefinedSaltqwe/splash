import {
  getTwoFactorTokenByEmail,
  getVerificationTokenByEmail,
} from "@/server/actions/fetch";
import { db } from "@/server/db";
import { Prisma } from "@prisma/client";
import { randomInt, randomUUID } from "crypto";

export const generateTwoFactorToken = async (email: string) => {
  const token = randomInt(100_000, 1_000_000).toString();
  //TODO: change to 15 mins
  // const expires = new Date(new Date().getTime() + 3600 * 1000);
  const expires = new Date(new Date().getTime() + 15 * 60 * 1000);
  console.log(expires);

  try {
    const existingToken = await getTwoFactorTokenByEmail(email);
    if (existingToken) {
      await db.twoFactorToken.delete({
        where: {
          id: existingToken.id,
        },
      });
    }
    const twoFactorToken = await db.twoFactorToken.create({
      data: {
        email,
        token,
        expires,
      },
    });
    return twoFactorToken;
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

export const generateVerificationToken = async (email: string) => {
  const token = randomUUID();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  try {
    const existingToken = await getVerificationTokenByEmail(email);
    if (existingToken) {
      await db.verificationToken.delete({
        where: {
          id: existingToken.id,
        },
      });
    }
    const verificationToken = await db.verificationToken.create({
      data: {
        email,
        token,
        expires,
      },
    });
    return verificationToken;
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
