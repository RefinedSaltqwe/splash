import { type ActionState } from "@/lib/create-safe-actions";
import { type Ticket } from "@prisma/client";
import { type z } from "zod";
import { type DeleteTicket } from "./schema";

type CountProps = {
  count: number;
};

export type InputType = z.infer<typeof DeleteTicket>;
export type ReturnType = ActionState<InputType, Ticket | CountProps>;
