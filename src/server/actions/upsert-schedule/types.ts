import { type ActionState } from "@/lib/create-safe-actions";
import { type LaborTracking } from "@prisma/client";
import { type z } from "zod";
import { type UpsertSchedule } from "./schema";

export type InputType = z.infer<typeof UpsertSchedule>;
export type ReturnType = ActionState<InputType, LaborTracking>;
