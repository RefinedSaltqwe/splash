"use client";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { env } from "@/env";
import { type Plan } from "@prisma/client";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import React, { useState } from "react";
import { toast } from "sonner";

type Props = {
  selectedPriceId: Plan | "";
};

const SubscriptionForm = ({ selectedPriceId }: Props) => {
  const elements = useElements();
  const stripeHook = useStripe();
  const [priceError, setPriceError] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    if (!selectedPriceId) {
      setPriceError("You need to select a plan to subscribe.");
      return;
    }
    setPriceError("");
    event.preventDefault();
    if (!stripeHook || !elements) return;
    setIsLoading(true);
    try {
      const { error } = await stripeHook.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${env.NEXT_PUBLIC_URL}admin`,
        },
      });
      if (error) {
        throw new Error();
      }
      toast.success("Payment successfull", {
        description: "Your payment has been successfully processed. ",
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      toast.error("Payment failed", {
        description:
          "We couldnt process your payment. Please try a different card",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <small className="text-destructive">{priceError}</small>
      <PaymentElement className="!text-foreground" />
      <Button disabled={!stripeHook || isLoading} className="mt-4 w-full">
        {isLoading ? (
          <Loader classNames="h-4 w-4 border-2 border-slate-400/80 dark:border-slate-500/80 animate-[spin_.5s_linear_infinite] brightness-100 saturate-200 !border-r-transparent" />
        ) : (
          "Submit"
        )}
      </Button>
    </form>
  );
};
export default SubscriptionForm;
