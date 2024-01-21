import Card from "@/app/(dashboard)/_components/containers/Card";
import Heading from "@/components/shared/Heading";
import { getCustomers, getInvoiceWithServices } from "@/server/actions/fetch";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import React from "react";
import InvoiceForm from "../../_components/InvoiceForm";

type UpdateInvoiceProps = {
  params: {
    invId: string;
  };
};

const UpdateInvoicePage: React.FC<UpdateInvoiceProps> = async ({ params }) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["customers"],
    queryFn: () => getCustomers(),
  });
  await queryClient.prefetchQuery({
    queryKey: ["invoice", params.invId],
    queryFn: () => getInvoiceWithServices(params.invId),
  });

  return (
    <section className="flex w-full flex-col">
      <Heading title={params.invId} subTitle="Update invoice." />
      <Card>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <InvoiceForm type="update" invId={params.invId} />
        </HydrationBoundary>
      </Card>
    </section>
  );
};
export default UpdateInvoicePage;
