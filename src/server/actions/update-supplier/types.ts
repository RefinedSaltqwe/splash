import { type ActionState } from "@/lib/create-safe-actions";
import { type Supplier } from "@prisma/client";
import { type z } from "zod";
import { type UpdateSupplier } from "./schema";

export type InputType = z.infer<typeof UpdateSupplier>;
export type ReturnType = ActionState<InputType, Supplier>;
