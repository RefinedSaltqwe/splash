import { type ActionState } from "@/lib/create-safe-actions";
import { type z } from "zod";
import { type DeleteTag } from "./schema";

export type InputType = z.infer<typeof DeleteTag>;
export type ReturnType = ActionState<InputType, { id: string }>;
