import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { stripe } from "@/lib/stripe";
import { getStripeOAuthLink } from "@/lib/utils";
import { db } from "@/server/db";
import { CheckCircleIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type LaunchPadPageProps = {
  params: {
    subaccountId: string;
  };
  searchParams: {
    state: string;
    code: string;
  };
};

const LaunchPadPage: React.FC<LaunchPadPageProps> = async ({
  params,
  searchParams,
}) => {
  const subaccountDetails = await db.subAccount.findUnique({
    where: {
      id: params.subaccountId,
    },
  });

  if (!subaccountDetails) {
    return;
  }

  const allDetailsExist =
    subaccountDetails.address &&
    subaccountDetails.subAccountLogo &&
    subaccountDetails.city &&
    subaccountDetails.companyEmail &&
    subaccountDetails.companyPhone &&
    subaccountDetails.country &&
    subaccountDetails.name &&
    subaccountDetails.state;

  const stripeOAuthLink = getStripeOAuthLink(
    "subaccount",
    `launchpad___${subaccountDetails.id}`,
  );

  let connectedStripeAccount = false;

  if (searchParams.code) {
    if (!subaccountDetails.connectAccountId) {
      try {
        const response = await stripe.oauth.token({
          grant_type: "authorization_code",
          code: searchParams.code,
        });
        await db.subAccount.update({
          where: { id: params.subaccountId },
          data: { connectAccountId: response.stripe_user_id },
        });
        connectedStripeAccount = true;
      } catch (error) {
        console.log("🔴 Could not connect stripe account", error);
      }
    }
  }

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="h-full w-full max-w-[800px]">
        <Card className="border-none">
          <CardHeader>
            <CardTitle>Lets get started!</CardTitle>
            <CardDescription>
              Follow the steps below to get your account setup.
            </CardDescription>
          </CardHeader>{" "}
          <CardContent className="flex flex-col gap-4">
            <div className="flex w-full items-center justify-between gap-2 rounded-lg border border-slate-200 p-4 dark:border-slate-700">
              <div className="flex flex-col gap-4 md:!flex-row md:items-center">
                <Image
                  src="/assets/icons/appstore.png"
                  alt="app logo"
                  height={80}
                  width={80}
                  className="rounded-md object-contain"
                />
                <p> Save the website as a shortcut on your mobile device</p>
              </div>
              <Button>Start</Button>
            </div>
            <div className="flex w-full items-center justify-between gap-2 rounded-lg border border-slate-200 p-4 dark:border-slate-700">
              <div className="flex flex-col gap-4 md:!flex-row md:items-center">
                <Image
                  src="/assets/icons/stripelogo.png"
                  alt="app logo"
                  height={80}
                  width={80}
                  className="rounded-md object-contain"
                />
                <p>
                  Connect your stripe account to accept payments and see your
                  dashboard.
                </p>
              </div>
              {subaccountDetails.connectAccountId ?? connectedStripeAccount ? (
                <CheckCircleIcon
                  size={50}
                  className=" flex-shrink-0 p-2 text-primary"
                />
              ) : (
                <Link
                  className="rounded-md bg-primary px-4 py-2 text-white"
                  href={stripeOAuthLink}
                >
                  Start
                </Link>
              )}
            </div>
            <div className="flex w-full items-center justify-between gap-2 rounded-lg border border-slate-200 p-4 dark:border-slate-700">
              <div className="flex flex-col gap-4 md:!flex-row md:items-center">
                <Image
                  src={subaccountDetails.subAccountLogo}
                  alt="app logo"
                  height={80}
                  width={80}
                  className="rounded-md object-contain"
                />
                <p> Fill in all your bussiness details</p>
              </div>
              {allDetailsExist ? (
                <CheckCircleIcon
                  size={50}
                  className="flex-shrink-0 p-2 text-primary"
                />
              ) : (
                <Link
                  className="rounded-md bg-primary px-4 py-2 text-white"
                  href={`/subaccount/${subaccountDetails.id}/settings`}
                >
                  Start
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default LaunchPadPage;
