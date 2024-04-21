import { type ActionState } from "@/lib/create-safe-actions";
import { type z } from "zod";
import { type DeleteSchedule } from "./schema";

type CountProps = {
  count: number;
};

export type InputType = z.infer<typeof DeleteSchedule>;
export type ReturnType = ActionState<InputType, CountProps>;
