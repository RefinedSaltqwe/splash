import { z } from "zod";

export const UpdateInvoice = z.object({
  id: z.string(),
  customerId: z.string(),
  status: z.string(),
  shipping: z.coerce.number().multipleOf(0.01),
  tax: z.coerce.number().multipleOf(0.01),
  payment: z.coerce.number().multipleOf(0.01),
  discount: z.coerce.number().multipleOf(0.01),
  subTotal: z.coerce.number().multipleOf(0.01),
  total: z.coerce.number().multipleOf(0.01),
  dueDate: z.date(),
  createdAt: z.date(),
  agencyId: z.string().optional(),
  services: z.array(
    z.object({
      price: z.coerce.number().multipleOf(0.01),
      invoiceId: z.string(),
      serviceTypeId: z.string(),
      description: z.string(),
    }),
  ),
  payments: z
    .array(
      z.object({
        id: z.string(),
        value: z.coerce.number().multipleOf(0.01),
      }),
    )
    .optional(),
});
