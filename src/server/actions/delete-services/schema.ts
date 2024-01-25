import { z } from "zod";

export const DeleteService = z.object({
  ids: z.string().array(),
});
