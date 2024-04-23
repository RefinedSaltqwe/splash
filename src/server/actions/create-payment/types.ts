import { type ActionState } from "@/lib/create-safe-actions";
import { type Payment } from "@prisma/client";
import { type z } from "zod";
import { type CreatePayment } from "./schema";

export type InputType = z.infer<typeof CreatePayment>;
export type ReturnType = ActionState<InputType, Payment>;
