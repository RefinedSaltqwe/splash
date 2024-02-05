import { type ActionState } from "@/lib/create-safe-actions";
import { type User } from "@prisma/client";
import { type z } from "zod";
import { type UpdateEmployee } from "./schema";

export type InputType = z.infer<typeof UpdateEmployee>;
export type ReturnType = ActionState<InputType, User>;
