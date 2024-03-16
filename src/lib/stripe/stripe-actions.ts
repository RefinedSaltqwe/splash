/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use server";
import type Stripe from "stripe";
import { stripe } from ".";
import { db } from "@/server/db";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export const subscriptionCreated = async (
  subscription: Stripe.Subscription,
  customerId: string,
) => {
  try {
    const agency = await db.agency.findFirst({
      where: {
        customerId,
      },
      include: {
        SubAccount: true,
      },
    });
    if (!agency) {
      throw new Error("Could not find and agency to upsert the subscription");
    }

    const data = {
      active: subscription.status === "active",
      agencyId: agency.id,
      customerId,
      currentPeriodEndDate: new Date(subscription.current_period_end * 1000),
      //@ts-expect-error
      priceId: subscription.plan.id,
      subscritiptionId: subscription.id,
      //@ts-expect-error
      plan: subscription.plan.id,
    };

    const res = await db.subscription.upsert({
      where: {
        agencyId: agency.id,
      },
      create: data,
      update: data,
    });

    if (!res) {
      return new NextResponse(`Cannot create or update subscription`, {
        status: 500,
      });
    }
    console.log(`🟢 Created Subscription for ${subscription.id}`);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientInitializationError ||
      error instanceof Prisma.PrismaClientKnownRequestError
    ) {
      return new NextResponse(`Error from Create action`, {
        status: 500,
      });
    }
    throw error;
  }
};

export const getConnectAccountProducts = async (stripeAccount: string) => {
  const products = await stripe.products.list(
    {
      limit: 50,
      expand: ["data.default_price"],
    },
    {
      stripeAccount,
    },
  );
  return products.data;
};
