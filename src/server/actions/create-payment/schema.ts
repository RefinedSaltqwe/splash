import { z } from "zod";

export const CreatePayment = z.object({
  value: z.coerce.number().multipleOf(0.01),
  invoiceId: z.string(),
  agencyId: z.string(),
});
