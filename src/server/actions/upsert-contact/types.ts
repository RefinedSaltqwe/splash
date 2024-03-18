import { type ActionState } from "@/lib/create-safe-actions";
import { type Contact } from "@prisma/client";
import { type z } from "zod";
import { type UpsertContact } from "./schema";

export type InputType = z.infer<typeof UpsertContact>;
export type ReturnType = ActionState<InputType, Contact>;
