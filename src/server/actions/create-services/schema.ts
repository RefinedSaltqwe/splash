import { z } from "zod";

export const CreateService = z.object({
  price: z.coerce.number().multipleOf(0.01),
  invoiceId: z.string(),
  serviceTypeId: z.string(),
  description: z.string(),
});
