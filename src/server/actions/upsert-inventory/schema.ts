import { z } from "zod";

export const UpsertInventory = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Required"),
  cost: z.coerce.number().multipleOf(0.01),
  quantity: z.coerce.number(),
  description: z.string().optional(),
  supplierId: z.string(),
  subaccountId: z.string().optional(),
  agencyId: z.string().optional(),
});
