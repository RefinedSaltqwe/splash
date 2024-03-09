import { z } from "zod";

export const CreatePipeline = z.object({
  name: z.string().min(1),
  subAccountId: z.string(),
  pipelineId: z.string().optional(),
});
