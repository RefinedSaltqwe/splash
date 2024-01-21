import { z } from "zod";

export const UpdateCustomer = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Full name is required."),
  companyName: z.string().optional(),
  address: z.string().min(5, { message: "Please enter the full address." }),
  email: z.string().email({ message: "Must be a valid email." }),
  phoneNumber: z.string(),
});
