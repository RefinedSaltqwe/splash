import { z } from "zod";

export const CreateTimesheet = z.object({
  dateFr: z.string(),
  dateTo: z.string(),
  agencyId: z.string(),
});
