import { type ActionState } from "@/lib/create-safe-actions";
import { type Lane } from "@prisma/client";
import { type z } from "zod";
import { type DeleteLane } from "./schema";

type CountProps = {
  count: number;
};

export type InputType = z.infer<typeof DeleteLane>;
export type ReturnType = ActionState<InputType, Lane | CountProps>;
