import { z } from "zod";

export const DeleteMedia = z.object({
  id: z.string(),
  subaccountId: z.string(),
});
