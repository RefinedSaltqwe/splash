import Card from "@/app/(dashboard)/_components/containers/Card";
import Heading from "@/components/shared/Heading";
import { getCustomers } from "@/server/actions/fetch";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import React from "react";
import InvoiceForm from "../_components/InvoiceForm";

const CreateInvoicePage: React.FC = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["customers"],
    queryFn: () => getCustomers(),
  });
  return (
    <section className="flex w-full flex-col">
      <Heading title="Create Invoice" subTitle="Create a new invoice" />
      <Card>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <InvoiceForm type="create" />
        </HydrationBoundary>
      </Card>
    </section>
  );
};
export default CreateInvoicePage;
