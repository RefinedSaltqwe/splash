import React from "react";

import { getConnectAccountProducts } from "@/lib/stripe/stripe-actions";
import { type Funnel } from "@prisma/client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import FunnelForm from "../../_components/FunnelForm";
import FunnelProductsTable from "./FunnelProductsTable";
import Link from "next/link";
import { ClipboardIcon } from "lucide-react";
import { getSubaccountDetails } from "@/server/actions/fetch";

interface FunnelSettingsProps {
  subaccountId: string;
  defaultData: Funnel;
}

const FunnelSettings: React.FC<FunnelSettingsProps> = ({
  subaccountId,
  defaultData,
}) => {
  const { data: subaccountDetails } = useQuery({
    queryKey: ["subaccount", subaccountId],
    queryFn: () => getSubaccountDetails(subaccountId),
  });
  const { data: products } = useQuery({
    queryKey: ["stripeProducts", subaccountId],
    queryFn: () =>
      getConnectAccountProducts(subaccountDetails?.connectAccountId ?? ""),
    enabled: !!subaccountDetails?.connectAccountId,
  });

  if (!subaccountDetails) return;

  return (
    <div className="flex flex-col gap-4 xl:!flex-row">
      <Card className="splash-border-color flex-1 flex-shrink border-[1px] shadow-none">
        <CardHeader>
          <CardTitle>Funnel Products</CardTitle>
          <CardDescription>
            Select the products and services you wish to sell on this funnel.
            You can sell one time and recurring products too.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <>
            {subaccountDetails.connectAccountId ? (
              <FunnelProductsTable
                defaultData={defaultData}
                products={products ?? []}
              />
            ) : (
              <Card className="splash-border-color border-[1px] shadow-none">
                <CardHeader>
                  <CardTitle>Connect Your Stripe</CardTitle>
                  <CardDescription>
                    You need to connect your stripe account to sell products
                  </CardDescription>
                  <Link
                    href={`/subaccount/${subaccountDetails.id}/launchpad`}
                    className="flex w-fit items-center gap-2 rounded-md bg-secondary p-2 text-foreground"
                  >
                    <ClipboardIcon />
                    Launch Pad
                  </Link>
                </CardHeader>
              </Card>
            )}
          </>
        </CardContent>
      </Card>

      <FunnelForm subAccountId={subaccountId} defaultData={defaultData} />
    </div>
  );
};

export default FunnelSettings;
