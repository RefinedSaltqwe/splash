/* eslint-disable @typescript-eslint/ban-ts-comment */
import Card from "@/app/(dashboard)/_components/containers/Card";
import Heading from "@/components/shared/Heading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { addOnProducts, pricingCards } from "@/constants/defaultsValues";
import { env } from "@/env";
import { stripe } from "@/lib/stripe";
import { db } from "@/server/db";
import clsx from "clsx";
import PricingCard from "./_components/PricingCard";
import SubscriptionHelper from "./_components/SubscriptionHelper";

type Props = {
  params: { agencyId: string };
};

const page = async ({ params }: Props) => {
  //CHALLENGE : Create the add on  products
  const addOns = stripe.products.list({
    ids: addOnProducts.map((product) => product.id),
    expand: ["data.default_price"],
  });

  const agencySubscription = db.agency.findUnique({
    where: {
      id: params.agencyId,
    },
    select: {
      customerId: true,
      Subscription: true,
    },
  });

  const prices = stripe.prices.list({
    product: env.NEXT_SPLASH_PRODUCT_ID,
    active: true,
  });

  const [addOnsResult, pricesResult, agencySubscriptionResult] =
    await Promise.all([addOns, prices, agencySubscription]);

  const currentPlanDetails = pricingCards.find(
    (c) => c.priceId === agencySubscriptionResult?.Subscription?.priceId,
  );

  const charges = await stripe.charges.list({
    limit: 50,
    customer: agencySubscriptionResult?.customerId,
  });

  const allCharges = [
    ...charges.data.map((charge) => ({
      description: charge.description,
      id: charge.id,
      date: `${new Date(charge.created * 1000).toLocaleTimeString()} ${new Date(
        charge.created * 1000,
      ).toLocaleDateString()}`,
      status: "Paid",
      amount: `$${charge.amount / 100}`,
    })),
  ];

  return (
    <section className="flex w-full flex-col">
      <SubscriptionHelper
        currentPlanTitle={currentPlanDetails?.title ?? ""}
        prices={pricesResult.data}
        customerId={agencySubscriptionResult?.customerId ?? ""}
        planExists={agencySubscriptionResult?.Subscription?.active === true}
      />
      <Heading title="Billing" />
      <h1 className="mb-5 text-2xl font-bold text-foreground">Current Plan</h1>
      <div className="flex flex-col justify-between gap-8 lg:!flex-row">
        <PricingCard
          agencyId={params.agencyId}
          planExists={agencySubscriptionResult?.Subscription?.active === true}
          prices={pricesResult.data}
          customerId={agencySubscriptionResult?.customerId ?? ""}
          amt={
            agencySubscriptionResult?.Subscription?.active === true
              ? currentPlanDetails?.price ?? "$0"
              : "$0"
          }
          buttonCta={
            agencySubscriptionResult?.Subscription?.active === true
              ? "Change Plan"
              : "Get Started"
          }
          highlightDescription="Want to modify your plan? You can do this here. If you have
          further question contact support@splashinovations.ca"
          highlightTitle="Plan Options"
          description={
            agencySubscriptionResult?.Subscription?.active === true
              ? currentPlanDetails?.description ?? "Lets get started"
              : "Lets get started! Pick a plan that works best for you."
          }
          duration="/ month"
          features={
            agencySubscriptionResult?.Subscription?.active === true
              ? currentPlanDetails?.features ?? []
              : currentPlanDetails?.features ??
                pricingCards.find((pricing) => pricing.title === "Starter")
                  ?.features ??
                []
          }
          currentPlanTitle={currentPlanDetails?.title ?? ""}
          title={
            agencySubscriptionResult?.Subscription?.active === true
              ? currentPlanDetails?.title ?? "Starter"
              : "Starter"
          }
        />
        {/* {addOnsResult.data.map((addOn) => (
          <PricingCard
            currentPlanTitle={currentPlanDetails?.title ?? ""}
            planExists={agencySubscriptionResult?.Subscription?.active === true}
            prices={pricesResult.data}
            customerId={agencySubscriptionResult?.customerId ?? ""}
            key={addOn.id}
            amt={
              //@ts-expect-error
              addOn.default_price?.unit_amount
                ? //@ts-expect-error
                  `$${addOn.default_price.unit_amount / 100}`
                : "$0"
            }
            buttonCta="Subscribe"
            description="Dedicated support line & teams channel for support"
            duration="/ month"
            features={[]}
            title={"24/7 priority support"}
            highlightTitle="Get support now!"
            highlightDescription="Get priority support and skip the long long with the click of a button."
          />
        ))} */}
      </div>
      <Heading title="Payment History" />
      <Card padding={false}>
        <Table className="border-0 bg-card">
          <TableHeader className="rounded-md">
            <TableRow className="splash-border-color">
              <TableHead className="w-[200px]">Description</TableHead>
              <TableHead className="w-[200px]">Invoice Id</TableHead>
              <TableHead className="w-[300px]">Date</TableHead>
              <TableHead className="w-[200px]">Paid</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="truncate font-medium ">
            {allCharges.map((charge) => (
              <TableRow key={charge.id} className="splash-border-color">
                <TableCell>{charge.description}</TableCell>
                <TableCell className="text-muted-foreground">
                  {charge.id}
                </TableCell>
                <TableCell>{charge.date}</TableCell>
                <TableCell>
                  <p
                    className={clsx("", {
                      "text-emerald-500":
                        charge.status.toLowerCase() === "paid",
                      "text-orange-600":
                        charge.status.toLowerCase() === "pending",
                      "text-red-600": charge.status.toLowerCase() === "failed",
                    })}
                  >
                    {charge.status.toUpperCase()}
                  </p>
                </TableCell>
                <TableCell className="text-right">{charge.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </section>
  );
};

export default page;
