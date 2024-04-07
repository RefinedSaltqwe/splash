import { type ActionState } from "@/lib/create-safe-actions";
import { type Inventory } from "@prisma/client";
import { type z } from "zod";
import { type UpsertInventory } from "./schema";

export type InputType = z.infer<typeof UpsertInventory>;
export type ReturnType = ActionState<InputType, Inventory>;
