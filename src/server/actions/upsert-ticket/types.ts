import { type ActionState } from "@/lib/create-safe-actions";
import { type TicketsWithTagsAssignedCustomer } from "@/types/prisma";
import { type z } from "zod";
import { type UpsertTicket } from "./schema";

export type InputType = z.infer<typeof UpsertTicket>;
export type ReturnType = ActionState<
  InputType,
  TicketsWithTagsAssignedCustomer
>;
