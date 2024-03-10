import { z } from "zod";

export const DeleteTag = z.object({
  pipelineId: z.string(),
  subaccountId: z.string(),
  id: z.string(),
});
