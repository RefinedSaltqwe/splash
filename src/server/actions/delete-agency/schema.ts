import { z } from "zod";

export const DeleteAgency = z.object({
  id: z.string(),
});
