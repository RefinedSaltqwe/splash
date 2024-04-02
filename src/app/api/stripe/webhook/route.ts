/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { type NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { subscriptionCreated } from "@/lib/stripe/stripe-actions";
import { env } from "@/env";
import { revalidatePath } from "next/cache";
import { db } from "@/server/db";

const stripeWebhookEvents = new Set([
  "product.created",
  "product.updated",
  "price.created",
  "price.updated",
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

export async function POST(req: NextRequest) {
  let stripeEvent: Stripe.Event;
  const body = await req.text();
  const sig = headers().get("Stripe-Signature");
  const webhookSecret: string =
    process.env.STRIPE_WEBHOOK_SECRET_LIVE ?? env.STRIPE_WEBHOOK_SECRET;
  try {
    if (!sig || !webhookSecret) {
      console.log(
        "🔴 Error Stripe webhook secret or the signature does not exist.",
      );
      return;
    }
    stripeEvent = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(`🔴 Error ${error.message}`);
      return new NextResponse(`Webhook Error: ${error.message}`, {
        status: 400,
      });
    }
    return new NextResponse(`Webhook Error:`, { status: 400 });
  }

  //
  try {
    if (stripeWebhookEvents.has(stripeEvent.type)) {
      // In Production there are 2 endpoints
      // One endpoint for connectedAccountPayments and another endpoint for connectAccountSubscriptions
      const subscription = stripeEvent.data.object as Stripe.Subscription;
      if (
        !subscription.metadata.connectAccountPayments &&
        !subscription.metadata.connectAccountSubscriptions
      ) {
        switch (stripeEvent.type) {
          case "customer.subscription.created":
          case "customer.subscription.updated": {
            if (subscription.status === "active") {
              await subscriptionCreated(
                subscription,
                subscription.customer as string,
              );
              const agency = await db.agency.findFirst({
                where: {
                  customerId: subscription.customer as string,
                },
                include: {
                  SubAccount: true,
                },
              });
              revalidatePath(`/admin/${agency?.id}/billing`, "page");
              console.log("CREATED FROM WEBHOOK 💳", subscription);
            } else {
              console.log(
                "SKIPPED AT CREATED FROM WEBHOOK 💳 because subscription status is not active",
                subscription,
              );
              break;
            }
          }
          default:
            console.log("👉🏻 Unhandled relevant event!", stripeEvent.type);
        }
      } else {
        console.log(
          "SKIPPED FROM WEBHOOK 💳 because subscription was from a connected account not for the application",
          subscription,
        );
      }
    }
  } catch (error) {
    console.log(error);
    return new NextResponse("🔴 Webhook Error", { status: 400 });
  }
  // this block is to let Stripe know that we have successfully processed the reponse from their end
  return NextResponse.json(
    {
      webhookActionReceived: true,
    },
    {
      status: 200,
    },
  );
}
