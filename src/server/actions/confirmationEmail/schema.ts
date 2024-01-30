import { z } from "zod";

export const ConfirmEmail = z.object({
  token: z.string(),
});
