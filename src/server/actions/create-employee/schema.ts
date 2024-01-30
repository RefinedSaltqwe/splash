import { z } from "zod";
// Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character
const passwordValidation = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
);

export const CreateEmployee = z
  .object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email({ message: "Must be a valid email" }),
    password: z
      .string()
      .min(1, { message: "Must have at least 1 character" })
      .regex(passwordValidation, {
        message: `Your password is not valid: Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character`,
      }),
    confirmPassword: z.string(),
    phoneNumber: z.string(),
    street: z.string(),
    country: z.string(),
    city: z.string(),
    state: z.string(),
    postalCode: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
