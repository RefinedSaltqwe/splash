/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use server";
import { env } from "@/env";
import { createSafeAction } from "@/lib/create-safe-actions";
import { currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { CreateStripeSecret } from "./schema";
import { type InputType, type ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const session = await currentUser();

  if (!session) {
    return {
      error: "Unauthorized",
    };
  }
  const { agencyId, customerId, selectedPriceId } = data;
  let subscriptionResponseResult;
  try {
    const subscriptionResponse = await fetch(
      `${env.NEXT_PUBLIC_URL}api/stripe/create-subscription`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId,
          priceId: selectedPriceId,
        }),
      },
    );
    const subscriptionResponseData = await subscriptionResponse.json();

    if (!subscriptionResponseData) {
      throw new Error("client secret error");
    }
    subscriptionResponseResult = {
      clientSecret: subscriptionResponseData.clientSecret,
      subscriptionId: subscriptionResponseData.subscriptionId,
    };
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        error: err.message,
      };
    }
  }

  revalidatePath(`/admin/${agencyId}/billing`, "page");
  return { data: subscriptionResponseResult };
};

export const createStripeSecret = createSafeAction(CreateStripeSecret, handler);
