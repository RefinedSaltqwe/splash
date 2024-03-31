"use client";
import Loading from "@/components/shared/Loading";
import { pricingCards } from "@/constants/defaultsValues";
import { useAction } from "@/hooks/useAction";
import { getStripe } from "@/lib/stripe/stripe-client";
import { cn } from "@/lib/utils";
import { createStripeSecret } from "@/server/actions/create-stripe-subscription";
import { useCurrentUserStore } from "@/stores/useCurrentUser";
import { useThemeMode } from "@/stores/useThemeMode";
import { RadioGroup } from "@headlessui/react";
import { type $Enums, type Plan } from "@prisma/client";
import { Elements } from "@stripe/react-stripe-js";
import { type StripeElementsOptions } from "@stripe/stripe-js";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { toast } from "sonner";
import SubscriptionForm from "./SubscriptionForm";

type SubscriptionFormWrapperProps = {
  customerId: string;
  planExists: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  currentPlanTitle: string;
  setIsLoading?: Dispatch<SetStateAction<boolean>>;
};

const SubscriptionFormWrapper = ({
  currentPlanTitle,
  customerId,
  planExists,
  setIsOpen,
  setIsLoading,
}: SubscriptionFormWrapperProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan: $Enums.Plan | undefined = searchParams.get("plan") as Plan;
  const plansData = useCurrentUserStore((state) => state.plansData);
  const setPlansData = useCurrentUserStore((state) => state.setPlansData);
  const agencyId = useCurrentUserStore((state) => state.agencyId);
  const [selectedPriceId, setSelectedPriceId] = useState<Plan | "">(
    plansData?.defaultPriceId ?? "",
  );
  const mode = useThemeMode((state) => state.mode);
  const [subscription, setSubscription] = useState<{
    subscriptionId: string;
    clientSecret: string;
  }>({ subscriptionId: "", clientSecret: "" });
  const options: StripeElementsOptions = useMemo(
    () => ({
      clientSecret: subscription?.clientSecret,
      appearance: {
        theme: "flat",
        variables: {
          colorText: "#6b7980",
          colorBackground: "#e2e8f0",
        },
      },
    }),
    [subscription],
  );
  const optionsDark: StripeElementsOptions = useMemo(
    () => ({
      clientSecret: subscription?.clientSecret,
      appearance: {
        theme: "flat",
        variables: {
          colorText: "#9ca3af",
          colorBackground: "#1e293b",
        },
      },
    }),
    [subscription],
  );

  const { execute: executeCreateSecret } = useAction(createStripeSecret, {
    onSuccess: (data) => {
      if (data) {
        setSubscription({
          clientSecret: data.clientSecret,
          subscriptionId: data.subscriptionId,
        });
      }
    },
    onError: (error) => {
      toast.error(error);
      console.log(error);
      if (setIsLoading) {
        setIsLoading(false);
      }
    },
    onComplete: () => {
      if (plan) {
        setPlansData(null, plansData?.plans ?? []);
        router.push(`/admin/${agencyId}/billing`);
        return;
      }
      router.refresh();
    },
  });

  useEffect(() => {
    if (!selectedPriceId) return;
    if (plansData?.defaultPriceId) {
      setPlansData(null, plansData?.plans ?? []);
      return;
    }
    if (setIsLoading) {
      setIsLoading(true);
    }
    void executeCreateSecret({
      customerId,
      selectedPriceId,
      agencyId: agencyId ? agencyId : "",
    });

    if (planExists) {
      setIsOpen(false);
    }
  }, [plansData, selectedPriceId, customerId]);

  return (
    <div className="border-none transition-all">
      <div className="flex flex-col gap-4">
        <RadioGroup
          value={selectedPriceId}
          onChange={(value) => {
            if (currentPlanTitle !== value.split("?+?")[1]) {
              setSelectedPriceId(value.split("?+?")[0] as Plan);
            } else {
              toast.warning("Cannot proceed", {
                description: "Please choose a different plan.",
              });
            }
          }}
        >
          <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
          <div className="space-y-4">
            {plansData?.plans.map((price) => {
              if (price.nickname !== "")
                if (price.nickname === "Starter" && !planExists) return;
              return (
                <RadioGroup.Option
                  key={price.id}
                  value={`${price.id}?+?${price.nickname}`}
                  className={cn(
                    selectedPriceId === price.id ||
                      currentPlanTitle === price.nickname
                      ? "border-primary ring-2 ring-primary"
                      : "border-gray-300",
                    "splash-border-color relative block cursor-pointer rounded-lg border bg-card px-6 py-4 shadow-sm focus:outline-none sm:flex sm:justify-between",
                  )}
                >
                  {({ active, checked }) => (
                    <>
                      <span className="flex items-center">
                        <span className="flex flex-col text-sm">
                          <RadioGroup.Label
                            as="span"
                            className="font-medium text-foreground"
                          >
                            {price.nickname}
                          </RadioGroup.Label>
                          <RadioGroup.Description
                            as="span"
                            className="text-muted-foreground"
                          >
                            <span className="block sm:inline">
                              {
                                pricingCards.find((p) => p.priceId === price.id)
                                  ?.description
                              }
                            </span>
                          </RadioGroup.Description>
                        </span>
                      </span>
                      <RadioGroup.Description
                        as="span"
                        className="mt-2 flex text-sm sm:ml-4 sm:mt-0 sm:flex-col sm:text-right"
                      >
                        <span className="font-medium text-foreground">
                          ${price.unit_amount ? price.unit_amount / 100 : "0"}
                        </span>
                        <span className="ml-1 text-muted-foreground sm:ml-0">
                          /mo
                        </span>
                      </RadioGroup.Description>
                      <span
                        className={cn(
                          active ? "border" : "border-2",
                          checked ? "border-primary" : "border-transparent",
                          "pointer-events-none absolute -inset-px rounded-lg",
                        )}
                        aria-hidden="true"
                      />
                    </>
                  )}
                </RadioGroup.Option>
              );
            })}

            {options.clientSecret && !planExists && (
              <>
                <h1 className="text-xl">Payment Method</h1>
                {mode === "dark" ? (
                  <Elements
                    stripe={getStripe()}
                    options={optionsDark}
                    key={mode}
                  >
                    <SubscriptionForm selectedPriceId={selectedPriceId} />
                  </Elements>
                ) : (
                  <Elements stripe={getStripe()} options={options} key={mode}>
                    <SubscriptionForm selectedPriceId={selectedPriceId} />
                  </Elements>
                )}
              </>
            )}

            {!options.clientSecret && selectedPriceId && (
              <div className="flex h-40 w-full items-center justify-center">
                <Loading />
              </div>
            )}
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default SubscriptionFormWrapper;
