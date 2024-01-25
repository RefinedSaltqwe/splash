import { type ActionState } from "@/lib/create-safe-actions";
import { type ServiceType } from "@prisma/client";
import { type z } from "zod";
import { type UpdateService } from "./schema";

export type InputType = z.infer<typeof UpdateService>;
export type ReturnType = ActionState<InputType, ServiceType>;
