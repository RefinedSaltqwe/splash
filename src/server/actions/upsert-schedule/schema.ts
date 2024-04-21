import { z } from "zod";

export const UpsertSchedule = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  description: z.string(),
  start: z.string().optional(),
  end: z.string().optional(),
  allDay: z.boolean().optional(),
  userId: z.string().min(1, { message: "Employee is required." }),
  agencyId: z.string().optional(),
});
