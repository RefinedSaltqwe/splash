import { z } from "zod";

export const DeleteSchedule = z.object({
  ids: z.string().array(),
});
