import { type ActionState } from "@/lib/create-safe-actions";
import { type Service } from "@prisma/client";
import { type z } from "zod";
import { type CreateService } from "./schema";

export type InputType = z.infer<typeof CreateService>;
export type ReturnType = ActionState<InputType, Service>;
