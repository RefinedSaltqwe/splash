import { type ActionState } from "@/lib/create-safe-actions";
import { type AuthorizedEmail } from "@prisma/client";
import { type z } from "zod";
import { type GetEmail } from "./schema";

export type InputType = z.infer<typeof GetEmail>;
export type ReturnType = ActionState<InputType, AuthorizedEmail | null>;
