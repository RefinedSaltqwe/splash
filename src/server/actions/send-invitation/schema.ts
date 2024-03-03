import { z } from "zod";

export const SendInvitation = z.object({
  email: z.string().email({ message: "Must be a valid email" }),
  agencyId: z.string(),
  role: z.enum([
    "SUPER_ADMIN",
    "AGENCY_OWNER",
    "AGENCY_ADMIN",
    "SUBACCOUNT_USER",
    "SUBACCOUNT_GUEST",
  ]),
});
