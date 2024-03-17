import { type ActionState } from "@/lib/create-safe-actions";
import { type Funnel } from "@prisma/client";
import { type z } from "zod";
import { type CreateFunnel } from "./schema";

export type InputType = z.infer<typeof CreateFunnel>;
export type ReturnType = ActionState<InputType, Funnel>;
