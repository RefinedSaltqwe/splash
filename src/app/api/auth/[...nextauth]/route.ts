import { authOptions } from "@/server/auth";
import { type NextApiRequest, type NextApiResponse } from "next";
import NextAuth, { type NextAuthOptions } from "next-auth";

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  return (await NextAuth(req, res, authOptions)) as NextAuthOptions;
}

export { handler as GET, handler as POST };
