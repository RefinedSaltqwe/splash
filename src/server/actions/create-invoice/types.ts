import { type z } from "zod";
import { type Invoice } from "@prisma/client";
import { type CreateInvoice } from "./schema";
import { type ActionState } from "@/lib/create-safe-actions";

export type InputType = z.infer<typeof CreateInvoice>;
export type ReturnType = ActionState<InputType, Invoice>;
