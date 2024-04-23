import { type ActionState } from "@/lib/create-safe-actions";
import { type InvoiceWithServiceAndPayment } from "@/types/prisma";
import { type z } from "zod";
import { type UpdateInvoice } from "./schema";

export type InputType = z.infer<typeof UpdateInvoice>;
export type ReturnType = ActionState<InputType, InvoiceWithServiceAndPayment>;
