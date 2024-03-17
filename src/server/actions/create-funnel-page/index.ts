"use server";

import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-actions";

import {
  saveActivityLogsNotification,
  upsertFunnelPage,
} from "@/server/queries";
import { randomUUID } from "crypto";
import { CreateFunnelPage } from "./schema";
import { type InputType, type ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { funnelPageId, funnelId, subaccountId, order, ...values } = data;
  let promiseAll;
  try {
    const response = await upsertFunnelPage(
      subaccountId!,
      {
        id: funnelPageId ?? randomUUID(),
        name: values.name,
        order: order!,
        pathName: values.pathName ?? "",
      },
      funnelId!,
    );

    if (!response) {
      throw new Error("Failed: could not save funnel page details.");
    }
    await saveActivityLogsNotification({
      agencyId: undefined,
      description: `Updated a funnel page | ${response?.name}`,
      subaccountId: subaccountId,
    });
    promiseAll = response;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        error: err.message,
      };
    }
  }

  revalidatePath(
    `/subaccount/${subaccountId}/funnels/${promiseAll?.id}`,
    "page",
  );
  return { data: promiseAll };
};

export const createFunnelPage = createSafeAction(CreateFunnelPage, handler);
