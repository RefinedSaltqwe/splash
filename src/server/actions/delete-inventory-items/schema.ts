import { z } from "zod";

export const DeleteInventoryItems = z.object({
  subaccountId: z.string().optional(),
  agencyId: z.string().optional(),
  ids: z.string().array(),
});
