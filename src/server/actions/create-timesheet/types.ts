import { type ActionState } from "@/lib/create-safe-actions";
import { type z } from "zod";
import { type CreateTimesheet } from "./schema";

export type InputType = z.infer<typeof CreateTimesheet>;
export type ReturnType = ActionState<
  InputType,
  { count: number; dateFr: Date; dateTo: Date }
>;
