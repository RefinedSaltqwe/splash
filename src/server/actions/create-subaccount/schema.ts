import { z } from "zod";

export const CreateSubaccount = z.object({
  id: z.string(),
  userName: z.string(),
  agencyId: z.string(),
  name: z.string(),
  companyEmail: z.string(),
  companyPhone: z.string().min(1),
  address: z.string(),
  city: z.string(),
  subAccountLogo: z.string(),
  zipCode: z.string(),
  state: z.string(),
  country: z.string(),
});
