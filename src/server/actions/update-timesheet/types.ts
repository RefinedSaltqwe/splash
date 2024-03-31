import { type ActionState } from "@/lib/create-safe-actions";
import { type z } from "zod";
import { type UpdateTimesheets } from "./schema";

export type InputType = z.infer<typeof UpdateTimesheets>;
export type ReturnType = ActionState<
  InputType,
  { count: number; dateFr: Date; dateTo: Date; status: string }
>;
