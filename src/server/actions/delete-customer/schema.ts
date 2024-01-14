import { z } from "zod";

export const DeleteCustomer = z.object({
  id: z.string(),
});
