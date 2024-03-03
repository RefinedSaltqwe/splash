"use server";

import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-actions";

import {
  saveActivityLogsNotification,
  upsertSubAccount,
} from "@/server/queries";
import { randomUUID } from "crypto";
import { CreateSubaccount } from "./schema";
import { type InputType, type ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  let promiseAll;
  const { agencyId, userName, ...rest } = data;
  try {
    const response = await upsertSubAccount({
      id: rest?.id ? rest.id : randomUUID(),
      address: rest.address,
      subAccountLogo: rest.subAccountLogo,
      city: rest.city,
      companyPhone: rest.companyPhone,
      country: rest.country,
      name: rest.name,
      state: rest.state,
      zipCode: rest.zipCode,
      createdAt: new Date(),
      updatedAt: new Date(),
      companyEmail: rest.companyEmail,
      agencyId: agencyId,
      connectAccountId: "",
      goal: 5000,
    });
    if (!response) throw new Error("No response from server");
    promiseAll = response;
    await saveActivityLogsNotification({
      agencyId: response.agencyId,
      description: `${userName} | updated sub account | ${response.name}`,
      subaccountId: response.id,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        error: err.message,
      };
    }
  }
  revalidatePath(`/admin/${agencyId}/all-subaccounts`);
  return { data: promiseAll };
};

export const createSubaccount = createSafeAction(CreateSubaccount, handler);
