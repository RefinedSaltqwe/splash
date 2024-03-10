import { type ActionState } from "@/lib/create-safe-actions";
import { type z } from "zod";
import { type UpsertLane } from "./schema";
import { type LaneDetail } from "@/types/stripe";

export type InputType = z.infer<typeof UpsertLane>;
export type ReturnType = ActionState<InputType, LaneDetail>;
