// import NextAuth from "next-auth";

import { authOptions } from "@/server/auth";
import { type NextApiRequest, type NextApiResponse } from "next";
import NextAuth from "next-auth";

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return await NextAuth(req, res, authOptions);
}

export { handler as GET, handler as POST };
