import { z } from "zod";

export const DeleteSubaccount = z.object({
  subaccountId: z.string(),
});
