"use client";
import { type PricesList } from "@/types/stripe";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import SubscriptionFormWrapper from "./SubscriptionFormWrapper";
import GlobalModal from "@/components/drawer/GlobalModal";
import { useCurrentUserStore } from "@/stores/useCurrentUser";
import { type Plan } from "@prisma/client";

type Props = {
  prices: PricesList["data"];
  customerId: string;
  planExists: boolean;
};

const SubscriptionHelper = ({ customerId, planExists, prices }: Props) => {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") as Plan;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const setPlansData = useCurrentUserStore((state) => state.setPlansData);

  useEffect(() => {
    if (plan) {
      setIsOpen(true);
      setPlansData(plan, prices);
    }
  }, [plan]);

  return (
    <div>
      <GlobalModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Upgrade Plan!"
        description="Get started today to get access to premium features"
      >
        <SubscriptionFormWrapper
          planExists={planExists}
          customerId={customerId}
          setIsOpen={setIsOpen}
        />
      </GlobalModal>
    </div>
  );
};

export default SubscriptionHelper;
