import { type ActionState } from "@/lib/create-safe-actions";
import { type z } from "zod";
import { type CreateLane } from "./schema";
import { type LaneDetail } from "@/types/stripe";

export type InputType = z.infer<typeof CreateLane>;
export type ReturnType = ActionState<InputType, LaneDetail>;
