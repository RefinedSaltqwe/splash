import { z } from "zod";

export const DeleteTicket = z.object({
  pipelineId: z.string(),
  subaccountId: z.string(),
  ticketId: z.string(),
});
