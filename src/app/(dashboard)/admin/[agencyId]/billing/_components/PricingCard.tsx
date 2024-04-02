"use client";
import GlobalModal from "@/components/drawer/GlobalModal";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { pricingCards } from "@/constants/defaultsValues";
import { pusher } from "@/lib/pusher/client";
import { useCurrentUserStore } from "@/stores/useCurrentUser";
import { type PricesList } from "@/types/stripe";
import { type Plan, type Subscription } from "@prisma/client";
import { CheckIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import SubscriptionFormWrapper from "./SubscriptionFormWrapper";

type Props = {
  agencyId: string;
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
  currentPlanTitle: string;
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
  currentPlanTitle,
  agencyId,
}: Props) => {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") as Plan;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const setPlansData = useCurrentUserStore((state) => state.setPlansData);
  const [currentPlan, setCurrentPlan] = useState({
    title,
    description,
    duration,
    features,
    amt,
    currentPlanTitle,
  });

  useEffect(() => {
    const channel = pusher.subscribe(`upsert-subscription-${agencyId}`);
    channel.bind("upsert", function (data: Subscription) {
      if (data) {
        const newPlanDetails = pricingCards.find(
          (c) => c.priceId === data.priceId,
        );
        setCurrentPlan({
          title: newPlanDetails?.title ?? "Starter",
          description:
            newPlanDetails?.description ?? "Perfect for trying out Splash",
          duration: newPlanDetails?.duration ?? "month",
          features: newPlanDetails?.features ?? [],
          amt: newPlanDetails?.price ?? "",
          currentPlanTitle: newPlanDetails?.price ?? "Starter",
        });
        setIsLoading(false);

        toast.success(
          `Plan successfully updated to "${newPlanDetails?.title}"`,
          {
            description: `You will be charged ${newPlanDetails?.price} on your next bill.`,
          },
        );
        console.log(newPlanDetails);
      } else {
        toast.error("Error: Please try again", {
          description: "If error persists contact admin.",
        });
      }
    });

    return () => {
      pusher.unsubscribe(`upsert-subscription-${agencyId}`);
    };
  }, []);

  const handleManagePlan = () => {
    setIsOpen(true);
    setPlansData(plan, prices);
  };

  return (
    <>
      <Card className="mx-auto w-full rounded-3xl lg:mx-0 lg:flex lg:max-w-none">
        <div className="p-8 sm:p-10 lg:flex-auto">
          <h3 className="text-2xl font-bold tracking-tight text-foreground">
            {currentPlan.title}
          </h3>
          <p className="mt-6 text-base leading-7 text-muted-foreground">
            {currentPlan.description}
          </p>
          <div className="mt-10 flex items-center gap-x-4">
            <h4 className="flex-none text-sm font-semibold leading-6 text-primary">
              {`Key features`}
            </h4>
            <div className="h-px flex-auto bg-muted-foreground/10" />
          </div>
          <ul
            role="list"
            className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-muted-foreground sm:grid-cols-2 sm:gap-6"
          >
            {currentPlan.features.map((feature) => (
              <li key={feature} className="flex gap-x-3">
                <CheckIcon
                  className="h-6 w-5 flex-none text-primary"
                  aria-hidden="true"
                />
                {feature}
              </li>
            ))}
          </ul>
        </div>
        <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
          <div className="rounded-2xl bg-background py-10 text-center ring-1 ring-inset ring-slate-200 lg:flex lg:flex-col lg:justify-center lg:py-16 dark:ring-slate-700">
            <div className="mx-auto max-w-xs px-8">
              <p className="text-base font-semibold text-muted-foreground">
                {highlightTitle}
              </p>
              <p className="mt-6 flex items-baseline justify-center gap-x-2">
                <span className="text-5xl font-bold tracking-tight text-foreground">
                  {currentPlan.amt}
                </span>
                <span className="text-sm font-semibold leading-6 tracking-wide text-muted-foreground">
                  {currentPlan.duration}
                </span>
              </p>
              <Button
                onClick={handleManagePlan}
                className="mt-10 w-full md:w-fit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader classNames="h-4 w-4 border-2 border-white/80 animate-[spin_.5s_linear_infinite] brightness-100 saturate-200 !border-r-transparent" />
                ) : (
                  buttonCta
                )}
              </Button>
              <p className="mt-6 text-xs leading-5 text-muted-foreground">
                {highlightDescription}
              </p>
            </div>
          </div>
        </div>
      </Card>
      <GlobalModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Manage Your Plan"
        description="You can change your plan at any time from the billings settings"
      >
        <SubscriptionFormWrapper
          setIsLoading={setIsLoading}
          currentPlanTitle={currentPlan.currentPlanTitle}
          customerId={customerId}
          planExists={planExists}
          setIsOpen={setIsOpen}
        />
      </GlobalModal>
    </>
  );
};

export default PricingCard;
