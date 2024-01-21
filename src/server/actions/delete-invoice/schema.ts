import { z } from "zod";

export const DeleteInvoice = z.object({
  id: z.array(z.string()),
  // id: z.union([z.string(), z.array(z.string())]),
  //stringOrNumber = z.string().or(z.number());
});
