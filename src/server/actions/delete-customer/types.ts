import { type z } from "zod";
import { type Customer } from "@prisma/client";
import { type DeleteCustomer } from "./schema";
import { type ActionState } from "@/lib/create-safe-actions";

export type InputType = z.infer<typeof DeleteCustomer>;
export type ReturnType = ActionState<InputType, Customer>;
