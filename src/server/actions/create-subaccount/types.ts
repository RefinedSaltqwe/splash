import { type ActionState } from "@/lib/create-safe-actions";
import { type SubAccount } from "@prisma/client";
import { type z } from "zod";
import { type CreateSubaccount } from "./schema";

export type InputType = z.infer<typeof CreateSubaccount>;
export type ReturnType = ActionState<InputType, SubAccount | undefined>;
