import { z } from "zod";

export const CreateService = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  agencyId: z.string(),
});
