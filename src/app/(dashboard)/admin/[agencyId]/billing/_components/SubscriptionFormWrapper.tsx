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
import { type Plan } from "@prisma/client";
import { Elements } from "@stripe/react-stripe-js";
import { type StripeElementsOptions } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
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
};

const SubscriptionFormWrapper = ({
  customerId,
  planExists,
  setIsOpen,
}: SubscriptionFormWrapperProps) => {
  const plans = useCurrentUserStore((state) => state.plansData);
  const router = useRouter();
  const plansData = useCurrentUserStore((state) => state.plansData);
  const agencyId = useCurrentUserStore((state) => state.agencyId);
  const [selectedPriceId, setSelectedPriceId] = useState<Plan | "">(
    plans?.defaultPriceId ?? "",
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
    },
  });

  useEffect(() => {
    if (!selectedPriceId) return;
    void executeCreateSecret({
      customerId,
      selectedPriceId,
      agencyId: agencyId ? agencyId : "",
    });

    if (planExists) {
      toast.success("Success", {
        description: "Your plan has been successfully upgraded!",
      });
      setIsOpen(false);
      router.refresh();
    }
  }, [plansData, selectedPriceId, customerId]);

  return (
    <div className="border-none transition-all">
      <div className="flex flex-col gap-4">
        <RadioGroup
          value={selectedPriceId}
          onChange={(value) => setSelectedPriceId(value as Plan)}
        >
          <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
          <div className="space-y-4">
            {plans?.plans.map((price) => (
              <RadioGroup.Option
                key={price.id}
                value={price.id}
                className={cn(
                  selectedPriceId === price.id
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
            ))}

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
