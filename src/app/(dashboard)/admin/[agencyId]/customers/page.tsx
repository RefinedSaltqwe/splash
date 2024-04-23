import Heading from "@/components/shared/Heading";
import { getCustomers } from "@/server/actions/fetch";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";
import CustomerList from "./_components/CustomerList";
import ClientButtonLink from "@/app/(dashboard)/_components/ButtonLinks/ClientButtonLink";

type CustomersPageProps = {
  params: {
    agencyId: string;
  };
};
const CustomersPage: React.FC<CustomersPageProps> = async ({ params }) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryFn: () => getCustomers(params.agencyId),
    queryKey: ["customers"],
  });

  return (
    <section className="flex w-full flex-col">
      <div className="flex items-center justify-between">
        <Heading title="Customers" subTitle="Customer list" />
        <ClientButtonLink
          buttonName="Create customer"
          href={`/admin/${params.agencyId}/customers/create`}
          variant={"default"}
        />
      </div>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <CustomerList agencyId={params.agencyId} />
      </HydrationBoundary>
    </section>
  );
};
export default CustomersPage;
