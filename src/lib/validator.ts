import * as z from "zod";

export const authValidatorSchema = z.object({
  email: z.string().email({ message: "Must be a valid email" }),
});

export const sampleFormValidator = z.object({
  website: z.string().min(4, "URL must be valid."),
  about: z
    .string()
    .min(3, "About must be at least 3 characters")
    .max(400, "About must be less than 400 characters"),
  photo: z.string(),
  coverPhoto: z.string(),
  firstname: z.string().min(1, "First name is required."),
  lastname: z.string().min(1, "Last name is required."),
  email: z.string().email({ message: "Must be a valid email" }),
  country: z.string().min(2, "Enter a valid country."),
  street: z.string().min(4, "Enter a valid street address."),
  city: z.string().min(3, "Enter a valid city."),
  province: z.string().min(2, "Enter a valid province."),
  postalCode: z
    .string()
    .min(3, "Enter a valid postal code.")
    .max(6, "Enter a valid postal code."),
  comments: z.boolean(),
  candidates: z.boolean(),
  offers: z.boolean(),
  pushNotifications: z.string(),
});

export const invoiceFormValidator = z.object({
  customerId: z.string(),
  serviceId: z.string().array(),
  createdAt: z.date(),
  dueDate: z.date(),
  payment: z.number(),
  total: z.number(),
  shipping: z.number() || z.literal("Free"),
  tax: z.number(),
  subTotal: z.number(),
  status: z.literal("1") || z.literal("2") || z.literal("3") || z.literal("4"),
});
