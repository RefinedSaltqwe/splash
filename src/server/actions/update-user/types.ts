import { type ActionState } from "@/lib/create-safe-actions";
import { type User } from "@prisma/client";
import { type z } from "zod";
import { type UpdateUser } from "./schema";

export type InputType = z.infer<typeof UpdateUser>;
export type ReturnType = ActionState<InputType, User>;
