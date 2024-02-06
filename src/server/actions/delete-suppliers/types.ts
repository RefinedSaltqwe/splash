import { type ActionState } from "@/lib/create-safe-actions";
import { type z } from "zod";
import { type DeleteSuppliers } from "./schema";

export type InputType = z.infer<typeof DeleteSuppliers>;
export type ReturnType = ActionState<InputType, { count: number | undefined }>;
