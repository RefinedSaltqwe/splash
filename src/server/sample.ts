/* eslint-disable @typescript-eslint/no-unsafe-return */

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { Prisma } from "@prisma/client";
import { compare } from "bcrypt";
import NextAuth, { type AuthOptions } from "next-auth";
import { decode, encode } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { cookies } from "next/headers";
import { type NextRequest } from "next/server";
import { randomUUID } from "node:crypto";
import { db } from "./db";
import { env } from "@/env";

interface Context {
  params: { nextauth: string[] };
}

// Configuration wrapper for NextAuth
const authOptionsWrapper = (request: NextRequest, context: Context) => {
  const { params } = context;

  // Determine if the current request is related to credentials callback
  const isCredentialsCallback =
    params?.nextauth?.includes("callback") &&
    params.nextauth.includes("credentials") &&
    request.method === "POST";

  // Common JWT options shared between encode and decode
  const commonJwtOptions: AuthOptions["jwt"] = {
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
  };

  return [
    request,
    context,
    {
      // Prisma Adapter for session and user management
      adapter: PrismaAdapter(db),
      providers: [
        // Google Authentication Provider
        GoogleProvider({
          clientId: env.GOOGLE_CLIENT_ID,
          clientSecret: env.GOOGLE_CLIENT_SECRET,
        }),
        // Credentials Authentication Provider
        CredentialsProvider({
          name: "Credentials",
          credentials: {
            email: {},
            password: {},
          },
          async authorize(credentials) {
            try {
              const user = await db.user.findUnique({
                where: {
                  email: credentials?.email,
                },
                include: {
                  accounts: true,
                },
              });

              const userPassword = user?.password ? user.password : "";
              const isPasswordCorrect = await compare(
                credentials!.password,
                userPassword,
              );

              if (isPasswordCorrect) {
                return user;
              } else {
                throw new Error("Account does not exist.");
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
      callbacks: {
        // Handle sign-in events
        async signIn({ user }) {
          if (isCredentialsCallback && user) {
            // Generate session token and set cookie
            const sessionToken = randomUUID();
            const sessionExpiry = new Date(
              Date.now() + 60 * 60 * 24 * 30 * 1000,
            );

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
          }
          return true;
        },
        async redirect({ baseUrl }) {
          return baseUrl;
        },
      },
      secret: env.NEXTAUTH_SECRET,
      jwt: commonJwtOptions,
      debug: process.env.NODE_ENV === "development",
    } as AuthOptions,
  ] as const;
};

// Authentication handler using NextAuth
function handler(request: NextRequest, context: Context) {
  return NextAuth(...authOptionsWrapper(request, context));
}

// Export handler for GET and POST requests
export { handler as GET, handler as POST };
