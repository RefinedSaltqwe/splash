import { z } from "zod";
const currencyNumberRegex = /^\d+(\.\d{1,2})?$/;
export const CreateTicket = z.object({
  subAccountId: z.string(),
  customerId: z.string(),
  laneId: z.string(),
  ticketId: z.string().optional(),
  assignedUserId: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
  value: z.string().refine((value) => currencyNumberRegex.test(value), {
    message: "Value must be a valid price.",
  }),
  tags: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      color: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
      subAccountId: z.string(),
    }),
  ),
});
