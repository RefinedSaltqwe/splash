import { z } from "zod";

export const CreateTag = z.object({
  color: z.string(),
  createdAt: z.date(),
  id: z.string(),
  name: z.string(),
  subAccountId: z.string(),
  updatedAt: z.date(),
});
