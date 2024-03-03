import { type ActionState } from "@/lib/create-safe-actions";
import { type z } from "zod";
import { type UpdateUserPermission } from "./schema";

export type InputType = z.infer<typeof UpdateUserPermission>;
export type ReturnType = ActionState<InputType, { message: string }>;
