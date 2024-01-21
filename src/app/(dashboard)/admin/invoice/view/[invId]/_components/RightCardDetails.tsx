"use client";
import { useCustomerList } from "@/stores/useCustomersList";
import { User } from "lucide-react";
import React from "react";

const RightCardDetails: React.FC = () => {
  const customer = useCustomerList((state) => state.customer);
  return (
    <div className="flex w-full flex-col space-y-2 p-10">
      <div className="flex w-full flex-row items-center space-x-3">
        <User size={20} className="text-muted-foreground" />
        <span className="font-normal text-foreground">{customer.name}</span>
      </div>
    </div>
  );
};
export default RightCardDetails;
