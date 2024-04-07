import { type ActionState } from "@/lib/create-safe-actions";
import { type z } from "zod";
import { type DeleteInventoryItems } from "./schema";

type CountProps = {
  count: number;
};

export type InputType = z.infer<typeof DeleteInventoryItems>;
export type ReturnType = ActionState<InputType, CountProps>;
