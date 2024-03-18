import { z } from "zod";

export const UpsertContact = z.object({
  name: z.string().min(1, "Required"),
  email: z.string().email(),
  subaccountId: z.string().optional(),
});
