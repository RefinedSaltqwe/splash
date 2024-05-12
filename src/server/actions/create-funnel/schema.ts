import { z } from "zod";

export const CreateFunnel = z.object({
  name: z.string().min(1),
  description: z.string(),
  subDomainName: z.string().optional(),
  favicon: z.string().optional(),
  subAccountId: z.string().optional(),
  defaultId: z.string().optional(),
  defaultLiveProducts: z.string().optional().nullable(),
});
