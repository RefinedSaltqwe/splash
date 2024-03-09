import { type ActionState } from "@/lib/create-safe-actions";
import { type Pipeline } from "@prisma/client";
import { type z } from "zod";
import { type CreatePipeline } from "./schema";

export type InputType = z.infer<typeof CreatePipeline>;
export type ReturnType = ActionState<InputType, Pipeline>;
