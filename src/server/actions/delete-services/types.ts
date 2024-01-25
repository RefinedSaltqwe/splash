import { type ActionState } from "@/lib/create-safe-actions";
import { type z } from "zod";
import { type DeleteService } from "./schema";

type CountProps = {
  count: number;
};

export type InputType = z.infer<typeof DeleteService>;
export type ReturnType = ActionState<InputType, CountProps>;
