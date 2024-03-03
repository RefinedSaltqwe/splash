import { type ActionState } from "@/lib/create-safe-actions";
import { type SubAccount } from "@prisma/client";
import { type z } from "zod";
import { type DeleteSubaccount } from "./schema";

export type InputType = z.infer<typeof DeleteSubaccount>;
export type ReturnType = ActionState<InputType, SubAccount | undefined | null>;
