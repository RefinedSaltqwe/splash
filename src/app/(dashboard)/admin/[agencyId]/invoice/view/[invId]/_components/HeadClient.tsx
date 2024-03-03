"use client";
import { getCustomer } from "@/server/actions/fetch";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import Head from "./Head";

type HeadClientProps = {
  customerId: string;
  dueDate: Date;
};

const HeadClient: React.FC<HeadClientProps> = ({ customerId, dueDate }) => {
  const { data: customer } = useQuery({
    queryKey: ["customer", customerId],
    queryFn: () => getCustomer(customerId),
  });

  return (
    <Head
      title="To"
      name={
        customer!.companyName !== "N/A" ? customer!.companyName : customer!.name
      }
      completeAddress={customer!.address}
      phoneNumber={customer!.phoneNumber}
      dateTitle="Due"
      date={dueDate}
    />
  );
};
export default HeadClient;
