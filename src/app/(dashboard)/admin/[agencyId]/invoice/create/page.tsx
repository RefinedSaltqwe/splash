import Card from "@/app/(dashboard)/_components/containers/Card";
import Heading from "@/components/shared/Heading";
import { getCustomers, getServiceTypes } from "@/server/actions/fetch";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import React from "react";
import InvoiceForm from "../_components/InvoiceForm";

type CreateInvoicePageProps = {
  params: {
    agencyId: string;
  };
};

const CreateInvoicePage: React.FC<CreateInvoicePageProps> = async ({
  params,
}) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["customers"],
    queryFn: () => getCustomers(params.agencyId),
  });
  await queryClient.prefetchQuery({
    queryKey: ["serviceTypes"],
    queryFn: () => getServiceTypes(params.agencyId),
  });
  return (
    <section className="flex w-full flex-col">
      <Heading title="Create Invoice" subTitle="Create a new invoice" />
      <Card>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <InvoiceForm type="create" agencyId={params.agencyId} />
        </HydrationBoundary>
      </Card>
    </section>
  );
};
export default CreateInvoicePage;
