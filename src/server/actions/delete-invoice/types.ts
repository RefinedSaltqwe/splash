import { type ActionState } from "@/lib/create-safe-actions";
import { type Invoice } from "@prisma/client";
import { type z } from "zod";
import { type DeleteInvoice } from "./schema";

type CountProps = {
  count: number;
};

export type InputType = z.infer<typeof DeleteInvoice>;
export type ReturnType = ActionState<InputType, CountProps>;
