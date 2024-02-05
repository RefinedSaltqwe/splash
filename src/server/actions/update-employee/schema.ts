import { z } from "zod";
// Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character
export const UpdateEmployee = z.object({
  id: z.string(),
  firstName: z.string().min(3, { message: "First name is required" }),
  lastName: z.string().min(3, { message: "Last name is required" }),
  email: z.string().email({ message: "Must be a valid email" }),
  phoneNumber: z.string(),
  street: z.string().min(3, { message: "Last name is required" }),
  country: z.string(),
  city: z.string().min(3, { message: "City is required" }),
  state: z.string().min(3, { message: "State is required" }),
  postalCode: z.string().min(3, { message: "Postal code is required" }),
  jobRole: z.string().min(2, { message: "Job role is required" }),
  role: z.string().min(2, { message: "Role is required" }),
});
