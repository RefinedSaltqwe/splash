import { type ActionState } from "@/lib/create-safe-actions";
import { type InvoiceWithServiceAndPayment } from "@/types/prisma";
import { type z } from "zod";
import { type CreateInvoice } from "./schema";

export type InputType = z.infer<typeof CreateInvoice>;
export type ReturnType = ActionState<InputType, InvoiceWithServiceAndPayment>;
