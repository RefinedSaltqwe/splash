import { z } from "zod";

export const DeleteSuppliers = z.object({
  ids: z.string().array(),
});
