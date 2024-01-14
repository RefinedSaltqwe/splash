import { z } from "zod";

export const DeleteCustomers = z.object({
  ids: z.string().array(),
});
