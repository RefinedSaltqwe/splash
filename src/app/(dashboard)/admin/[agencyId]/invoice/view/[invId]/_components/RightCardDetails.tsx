"use client";
import { getCustomer } from "@/server/actions/fetch";
import { useQuery } from "@tanstack/react-query";
import { User } from "lucide-react";
import React from "react";
type RightCardDetailsProps = {
  customerId: string;
};
const RightCardDetails: React.FC<RightCardDetailsProps> = ({ customerId }) => {
  const { data: customer } = useQuery({
    queryKey: ["customer", customerId],
    queryFn: () => getCustomer(customerId),
  });
  return (
    <div className="flex w-full flex-col space-y-2 p-10">
      <div className="flex w-full flex-row items-center space-x-3">
        <User size={20} className="text-muted-foreground" />
        <span className="font-normal text-foreground">{customer!.name}</span>
      </div>
    </div>
  );
};
export default RightCardDetails;
