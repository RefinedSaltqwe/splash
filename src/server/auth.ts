import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type DefaultUser,
  type NextAuthOptions,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import { cookies } from "next/headers";
import { db } from "./db";

import { env } from "@/env";
import { confirmationEmail } from "@/lib/confirmationEmail";
import { LoginFormSchema } from "@/lib/validator";
import { Prisma } from "@prisma/client";
import { compare } from "bcrypt";
import { randomUUID } from "crypto";
import { type GetServerSidePropsContext } from "next";
import { decode, encode } from "next-auth/jwt";
import {
  getTwoFactorConfirmationByUserId,
  getTwoFactorTokenByEmail,
  getUserByEmail,
} from "./actions/fetch";
import { twoFactorEmail } from "@/lib/twoFactorEmail";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }
  interface User extends DefaultUser {
    role: string | null;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */

let isCredentialsCallback: boolean;

export const authOptions: NextAuthOptions = {
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "credentials" && user) {
        // Check if email verified
        const existingUser = await getUserByEmail(user.email ? user.email : "");
        if (!existingUser?.emailVerified) {
          await confirmationEmail(user.email ? user.email : "");
          return false;
        }

        //Check if there is confirmation
        if (existingUser.isTwoFactorEnabled) {
          //Check if 2fa confirmed
          const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
            existingUser.id,
          );
          // If it is not confirmed yet
          if (!twoFactorConfirmation) {
            return false;
          }

          // Delete Confirmation after authenticated
          await db.twoFactorConfirmation.delete({
            where: { id: twoFactorConfirmation.id },
          });
        }

        isCredentialsCallback = true;
        // Generate session token and set cookie
        const sessionToken = randomUUID();
        const sessionExpiry = new Date(Date.now() + 60 * 60 * 24 * 30 * 1000);

        await db.session.create({
          data: {
            sessionToken,
            userId: user.id,
            expires: sessionExpiry,
          },
        });

        cookies().set("next-auth.session-token", sessionToken, {
          expires: sessionExpiry,
        });
      } else {
        //Using OAuth
        const userExist = await db.authorizedEmail.findUnique({
          where: {
            email: user.email ? user.email : "",
          },
        });
        //Check if email exist in the db
        if (!userExist) {
          return false;
        } else {
          // If exist and not registered then update to true
          if (userExist.registered === false) {
            const updateAuthEmail = await db.authorizedEmail.update({
              where: {
                email: user.email ? user.email : "",
              },
              data: {
                registered: true,
              },
            });
            if (updateAuthEmail) {
              return true;
            }
          }
          return true;
        }
      }
      return true;
    },
    session({ session, user }) {
      session.user.role = user.role ? user.role : "user";
      session.user.id = user.id;
      return session;
    },
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 30,
    encode: async (arg) => {
      if (isCredentialsCallback) {
        // Retrieve and return session token from the cookie
        const cookie = cookies().get("next-auth.session-token");
        return cookie?.value ?? "";
      }
      return encode(arg);
    },
    decode: async (arg) => {
      if (isCredentialsCallback) {
        // Prevent decoding during credentials callback
        return null;
      }
      return decode(arg);
    },
  },
  events: {
    async signOut({ session }) {
      const { sessionToken = "" } = session as unknown as {
        sessionToken?: string;
      };

      if (sessionToken) {
        await db.session.deleteMany({
          where: {
            sessionToken,
          },
        });
      }
    },
  },
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
        code: {},
      },
      async authorize(credentials) {
        const validatedFields = LoginFormSchema.safeParse(credentials);

        try {
          if (validatedFields.success) {
            const { email, password, code } = validatedFields.data;
            const user = await db.user.findUnique({
              where: {
                email,
              },
              include: {
                accounts: true,
              },
            });

            const userName = `${user?.firstName}`;
            const userEmail = user?.email ? user?.email : "";
            const userPassword = user?.password ? user.password : "";
            const isPasswordCorrect = await compare(password, userPassword);

            if (isPasswordCorrect) {
              // If Two Factor Authentication enabled
              const codeLength = code ? code.length : 0;
              console.log(
                "+++++++++++++++++++++++++++++Code: ",
                codeLength >= 0,
              );

              if (user?.isTwoFactorEnabled) {
                if (code) {
                  //VERIFY CODE
                  const twoFactorToken =
                    await getTwoFactorTokenByEmail(userEmail);

                  if (!twoFactorToken) {
                    throw new Error("Invalid code!");
                  }

                  if (twoFactorToken.token !== code) {
                    throw new Error("Invalid code!");
                  }

                  await db.twoFactorToken.delete({
                    where: { id: twoFactorToken.id },
                  });

                  const hasExpired =
                    new Date(twoFactorToken.expires) < new Date();

                  if (hasExpired) {
                    throw new Error("Code has expired!");
                  }
                  const existingConfirmation =
                    await getTwoFactorConfirmationByUserId(user.id);

                  if (existingConfirmation) {
                    await db.twoFactorConfirmation.delete({
                      where: { id: existingConfirmation.id },
                    });
                  }

                  await db.twoFactorConfirmation.create({
                    data: {
                      userId: user.id,
                    },
                  });
                } else {
                  // ? SEND two factor code
                  await twoFactorEmail(userEmail, userName);
                  throw new Error("two-factor-needed");
                }
              }
              return user;
            } else {
              throw new Error("Account does not exist.");
            }
          } else {
            throw new Error("Invalid Inputs.");
          }
        } catch (error) {
          if (
            error instanceof Prisma.PrismaClientInitializationError ||
            error instanceof Prisma.PrismaClientKnownRequestError
          ) {
            throw new Error("System error. Please contact support");
          }
          throw error;
        }
      },
    }),
  ],
};
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
