import { z } from "zod";

export const UpdateUser = z.object({
  id: z.string(),
  name: z.string().min(1),
  email: z.string().email(),
  image: z.string(),
  role: z.enum([
    "SUPER_ADMIN",
    "AGENCY_OWNER",
    "AGENCY_ADMIN",
    "SUBACCOUNT_USER",
    "SUBACCOUNT_GUEST",
  ]),
});
