import { z } from "zod";

export const Service = z.object({
  price: z.coerce.number().multipleOf(0.01),
  invoiceId: z.string().optional().default(""),
  serviceTypeId: z.string().optional().default(""),
  description: z.string().optional().default(""),
});
