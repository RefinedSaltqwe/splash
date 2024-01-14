"use server";

import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-actions";

import { CreateInvoice } from "./schema";
import { type InputType, type ReturnType } from "./types";
import { db } from "@/server/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";

const handler = async (data: InputType): Promise<ReturnType> => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  let card;

  // try {
  //   const list = await db.list.findUnique({
  //     where: {
  //       id: listId,
  //       board: {
  //         orgId,
  //       },
  //     },
  //   });

  //   if (!list) {
  //     return {
  //       error: "List not found",
  //     };
  //   }

  //   // ? Get the last card in this list to determine the order number
  //   const lastCard = await db.card.findFirst({
  //     where: { listId },
  //     orderBy: { order: "desc" },
  //     select: { order: true },
  //   });

  //   // ? Last card order number plus + 1
  //   const newOrder = lastCard ? lastCard.order + 1 : 1;

  //   // ? Create new Card with the new order number
  //   card = await db.card.create({
  //     data: {
  //       title,
  //       listId,
  //       order: newOrder,
  //     },
  //   });

  //   // await createAuditLog({
  //   //   entityId: card.id,
  //   //   entityTitle: card.title,
  //   //   entityType: ENTITY_TYPE.CARD,
  //   //   action: ACTION.CREATE,
  //   // });
  // } catch (error) {
  //   return {
  //     error: "Failed to create.",
  //   };
  // }

  // revalidatePath(`/board/${boardId}`);
  return { data: card };
};

export const createInvoice = createSafeAction(CreateInvoice, handler);
