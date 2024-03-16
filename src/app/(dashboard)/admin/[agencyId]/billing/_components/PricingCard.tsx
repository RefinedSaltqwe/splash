"use client";
import GlobalModal from "@/components/drawer/GlobalModal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type PricesList } from "@/types/stripe";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import SubscriptionFormWrapper from "./SubscriptionFormWrapper";
import { useCurrentUserStore } from "@/stores/useCurrentUser";
import { type Plan } from "@prisma/client";
import { cn } from "@/lib/utils";

type Props = {
  features: string[];
  buttonCta: string;
  title: string;
  description: string;
  amt: string;
  duration: string;
  highlightTitle: string;
  highlightDescription: string;
  customerId: string;
  prices: PricesList["data"];
  planExists: boolean;
};

const PricingCard = ({
  amt,
  buttonCta,
  customerId,
  description,
  duration,
  features,
  highlightDescription,
  highlightTitle,
  planExists,
  prices,
  title,
}: Props) => {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") as Plan;
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const setPlansData = useCurrentUserStore((state) => state.setPlansData);

  const handleManagePlan = () => {
    setIsOpen(true);
    setPlansData(plan, prices);
  };
  return (
    <>
      <Card className="flex flex-col justify-between lg:w-1/2">
        <div>
          <CardHeader className="flex flex-col justify-between md:!flex-row">
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
            <p className="text-6xl font-bold">
              {amt}
              <small className="text-xs font-light text-muted-foreground">
                {duration}
              </small>
            </p>
          </CardHeader>
          <CardContent>
            <ul>
              {features.map((feature) => (
                <li
                  key={feature}
                  className="ml-4 list-disc text-muted-foreground"
                >
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </div>
        <CardFooter>
          <Card className={cn("w-full shadow-none", "splash-border-color")}>
            <div className="splash-border-color flex flex-col items-center justify-between gap-4 rounded-lg border p-4 md:!flex-row">
              <div>
                <p>{highlightTitle}</p>
                <p className="text-sm text-muted-foreground">
                  {highlightDescription}
                </p>
              </div>

              <Button className="w-full md:w-fit" onClick={handleManagePlan}>
                {buttonCta}
              </Button>
            </div>
          </Card>
        </CardFooter>
      </Card>
      <GlobalModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Manage Your Plan"
        description="You can change your plan at any time from the billings settings"
      >
        <SubscriptionFormWrapper
          customerId={customerId}
          planExists={planExists}
          setIsOpen={setIsOpen}
        />
      </GlobalModal>
    </>
  );
};

export default PricingCard;
