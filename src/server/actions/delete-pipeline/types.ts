import { type ActionState } from "@/lib/create-safe-actions";
import { type Pipeline } from "@prisma/client";
import { type z } from "zod";
import { type DeletePipeline } from "./schema";

type CountProps = {
  count: number;
};

export type InputType = z.infer<typeof DeletePipeline>;
export type ReturnType = ActionState<InputType, Pipeline | CountProps>;
