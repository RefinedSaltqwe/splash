import { z } from "zod";

export const UpsertLane = z.object({
  name: z.string().min(1),
  subAccountId: z.string(),
  pipelineId: z.string(),
  laneId: z.string().optional(),
  order: z.number().optional(),
});
