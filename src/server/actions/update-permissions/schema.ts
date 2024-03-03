import { z } from "zod";

export const UpdateUserPermission = z.object({
  subAccountId: z.string(),
  val: z.boolean(),
  permissionsId: z.string().optional(),
  type: z.union([z.literal("agency"), z.literal("subaccount")]),
  userData: z.object({
    id: z.string().optional(),
    name: z.string().optional(),
    email: z.string().optional(),
  }),
  agencyId: z.string().optional(),
  page: z.string(),
});
