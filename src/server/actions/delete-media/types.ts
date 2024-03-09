import { type ActionState } from "@/lib/create-safe-actions";
import { type z } from "zod";
import { type DeleteMedia } from "./schema";
import { type Media } from "@prisma/client";

type CountProps = {
  count: number;
};

export type InputType = z.infer<typeof DeleteMedia>;
export type ReturnType = ActionState<InputType, Media>;
