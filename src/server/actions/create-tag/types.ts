import { type ActionState } from "@/lib/create-safe-actions";
import { type Tag } from "@prisma/client";
import { type z } from "zod";
import { type CreateTag } from "./schema";

export type InputType = z.infer<typeof CreateTag>;
export type ReturnType = ActionState<InputType, Tag>;
