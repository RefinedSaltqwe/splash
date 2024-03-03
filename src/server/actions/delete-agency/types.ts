import { type ActionState } from "@/lib/create-safe-actions";
import { type Agency } from "@prisma/client";
import { type z } from "zod";
import { type DeleteAgency } from "./schema";

export type InputType = z.infer<typeof DeleteAgency>;
export type ReturnType = ActionState<InputType, Agency>;
