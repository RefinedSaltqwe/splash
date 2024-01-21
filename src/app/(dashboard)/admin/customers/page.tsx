import Heading from "@/components/shared/Heading";
import { getCustomers } from "@/server/actions/fetch";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";
import ClientButtonLink from "../../_components/ButtonLinks/ClientButtonLink";
import CustomerList from "./_components/CustomerList";

const CustomersPage: React.FC = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryFn: () => getCustomers(),
    queryKey: ["customers"],
  });

  return (
    <section className="flex w-full flex-col">
      <div className="flex items-center justify-between">
        <Heading title="Customers" subTitle="Customer list" />
        <ClientButtonLink
          buttonName="Create Customer"
          href="/admin/customers/create"
          variant={"secondary"}
        />
      </div>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <CustomerList />
      </HydrationBoundary>
    </section>
  );
};
export default CustomersPage;
