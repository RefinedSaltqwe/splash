"use client";
import React, { useEffect } from "react";
import Head from "./Head";
import { useCustomerList } from "@/stores/useCustomersList";
import { useRouter } from "next/navigation";

type HeadClientProps = {
  customerId: string;
  dueDate: Date;
};

const HeadClient: React.FC<HeadClientProps> = ({ customerId, dueDate }) => {
  const customerList = useCustomerList();
  const router = useRouter();
  if (customerList.customers.length === 0) {
    router.push("/admin/invoice");
    return;
  }
  const customer = customerList.customers.filter(
    (person) => person.id === customerId,
  );
  useEffect(() => {
    customerList.setCustomer(customer[0]!);
  }, []);
  return (
    <Head
      title="To"
      name={
        customer[0]!.companyName !== "N/A"
          ? customer[0]!.companyName
          : customer[0]!.name
      }
      completeAddress={customer[0]!.address}
      phoneNumber={customer[0]!.phoneNumber}
      dateTitle="Due"
      date={dueDate}
    />
  );
};
export default HeadClient;
