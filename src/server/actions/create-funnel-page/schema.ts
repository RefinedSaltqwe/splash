import { z } from "zod";

export const CreateFunnelPage = z.object({
  name: z.string().min(1),
  pathName: z.string().optional(),
  funnelPageId: z.string().optional(),
  funnelId: z.string().optional(),
  order: z.number().optional(),
  subaccountId: z.string().optional(),
});
