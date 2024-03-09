import { type ActionState } from "@/lib/create-safe-actions";
import { type TicketsWithTagsAssignedCustomer } from "@/types/prisma";
import { type z } from "zod";
import { type CreateTicket } from "./schema";

export type InputType = z.infer<typeof CreateTicket>;
export type ReturnType = ActionState<
  InputType,
  TicketsWithTagsAssignedCustomer
>;
