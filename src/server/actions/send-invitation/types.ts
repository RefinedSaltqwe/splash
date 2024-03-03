import { type ActionState } from "@/lib/create-safe-actions";
import { type User } from "@prisma/client";
import { type z } from "zod";
import { type SendInvitation } from "./schema";

export type InputType = z.infer<typeof SendInvitation>;
export type ReturnType = ActionState<InputType, Partial<User>>;
