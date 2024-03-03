import { z } from "zod";

export const CreateTimesheet = z.object({
  dateFr: z.date(),
  dateTo: z.date(),
  agencyId: z.string(),
});
