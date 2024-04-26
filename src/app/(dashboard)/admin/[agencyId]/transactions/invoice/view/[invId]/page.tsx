import Heading from "@/components/shared/Heading";
import { getCustomer, getInvoiceWithServices } from "@/server/actions/fetch";
import { db } from "@/server/db";
import { type Invoice } from "@prisma/client";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import React from "react";
import ClientData from "./_components/ClientData";

type InvoiceDetailsPageProps = {
  params: {
    invId: string;
    agencyId: string;
  };
};

export const dynamic = "force-dynamic";

export async function generateStaticParams({
  params,
}: InvoiceDetailsPageProps) {
  const invoices: Invoice[] = await db.invoice.findMany({
    where: {
      Agency: {
        id: params.agencyId,
      },
    },
  });
  return invoices.map((row) => {
    agencyId: row.agencyId.toString();
    invId: row.id.toString();
  });
}

const InvoiceDetailsPage: React.FC<InvoiceDetailsPageProps> = async ({
  params,
}) => {
  const invID = params.invId;
  const invoiceWithServices = await getInvoiceWithServices(invID);
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["customer", invoiceWithServices!.customerId],
    queryFn: () => getCustomer(invoiceWithServices!.customerId),
  });

  return (
    <section className="w-full">
      <Heading title={invID} subTitle="Invoice Details" />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ClientData invoiceWithServices={invoiceWithServices} invID={invID} />
      </HydrationBoundary>
    </section>
  );
};
export default InvoiceDetailsPage;
