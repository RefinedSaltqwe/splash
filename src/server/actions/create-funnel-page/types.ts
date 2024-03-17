import { type ActionState } from "@/lib/create-safe-actions";
import { type FunnelPage } from "@prisma/client";
import { type z } from "zod";
import { type CreateFunnelPage } from "./schema";

export type InputType = z.infer<typeof CreateFunnelPage>;
export type ReturnType = ActionState<InputType, FunnelPage>;
