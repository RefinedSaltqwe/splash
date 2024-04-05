import { z } from "zod";

// export const UpdateTimesheets = z.object({
//   timesheets: z.string(),
// });

//tue: z.union([z.date(), z.null()]),
export const UpdateTimesheets = z.object({
  status: z.string(),
  timesheets: z.array(
    z
      .object({
        id: z.string(),
        status: z.string(),
        userId: z.string(),
        dateFr: z.string(),
        dateTo: z.string(),
        agencyId: z.string(),
        timeIn: z
          .object({
            id: z.string(),
            mon: z.string(),
            tue: z.string(),
            wed: z.string(),
            thu: z.string(),
            fri: z.string(),
            sat: z.string(),
            sun: z.string(),
            timesheetId: z.string(),
          })
          .nullable()
          .optional(),
        breakOut: z
          .object({
            id: z.string(),
            mon: z.string(),
            tue: z.string(),
            wed: z.string(),
            thu: z.string(),
            fri: z.string(),
            sat: z.string(),
            sun: z.string(),
            timesheetId: z.string(),
          })
          .nullable()
          .optional(),
        breakIn: z
          .object({
            id: z.string(),
            mon: z.string(),
            tue: z.string(),
            wed: z.string(),
            thu: z.string(),
            fri: z.string(),
            sat: z.string(),
            sun: z.string(),
            timesheetId: z.string(),
          })
          .nullable()
          .optional(),
        timeOut: z
          .object({
            id: z.string(),
            mon: z.string(),
            tue: z.string(),
            wed: z.string(),
            thu: z.string(),
            fri: z.string(),
            sat: z.string(),
            sun: z.string(),
            timesheetId: z.string(),
          })
          .nullable()
          .optional(),
        timeTotal: z
          .object({
            id: z.string(),
            mon: z.coerce.number().multipleOf(0.01),
            tue: z.coerce.number().multipleOf(0.01),
            wed: z.coerce.number().multipleOf(0.01),
            thu: z.coerce.number().multipleOf(0.01),
            fri: z.coerce.number().multipleOf(0.01),
            sat: z.coerce.number().multipleOf(0.01),
            sun: z.coerce.number().multipleOf(0.01),
            total: z.coerce.number().multipleOf(0.01),
            timesheetId: z.string(),
          })
          .nullable()
          .optional(),
      })
      .nullable(),
  ),
});
