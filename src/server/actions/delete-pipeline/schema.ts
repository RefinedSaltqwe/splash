import { z } from "zod";

export const DeletePipeline = z.object({
  pipelineId: z.string(),
  subaccountId: z.string(),
});
