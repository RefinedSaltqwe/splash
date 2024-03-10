import { z } from "zod";

export const DeleteLane = z.object({
  pipelineId: z.string(),
  subaccountId: z.string(),
  laneId: z.string(),
});
