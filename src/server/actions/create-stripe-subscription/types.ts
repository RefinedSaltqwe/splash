import { type ActionState } from "@/lib/create-safe-actions";
import { type z } from "zod";
import { type CreateStripeSecret } from "./schema";

type StripeSubscription = {
  clientSecret: string;
  subscriptionId: string;
};

export type InputType = z.infer<typeof CreateStripeSecret>;
export type ReturnType = ActionState<InputType, StripeSubscription>;
