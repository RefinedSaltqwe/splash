import { type ActionState } from "@/lib/create-safe-actions";
import { type Media } from "@prisma/client";
import { type z } from "zod";
import { type UploadMedia } from "./schema";

export type InputType = z.infer<typeof UploadMedia>;
export type ReturnType = ActionState<InputType, Media>;
