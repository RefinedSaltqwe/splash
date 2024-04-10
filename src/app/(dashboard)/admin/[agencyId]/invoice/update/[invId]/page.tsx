import Card from "@/app/(dashboard)/_components/containers/Card";
import Heading from "@/components/shared/Heading";
import {
  getCustomers,
  getInvoiceWithServices,
  getServiceTypes,
} from "@/server/actions/fetch";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import React from "react";
import InvoiceForm from "../../_components/InvoiceForm";
import { db } from "@/server/db";
import { type Invoice } from "@prisma/client";

type UpdateInvoiceProps = {
  params: {
    invId: string;
    agencyId: string;
  };
};

export const dynamic = "force-dynamic";

export async function generateStaticParams({ params }: UpdateInvoiceProps) {
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

const UpdateInvoicePage: React.FC<UpdateInvoiceProps> = async ({ params }) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["customers"],
    queryFn: () => getCustomers(params.agencyId),
  });
  await queryClient.prefetchQuery({
    queryKey: ["invoice", params.invId],
    queryFn: () => getInvoiceWithServices(params.invId),
  });
  await queryClient.prefetchQuery({
    queryKey: ["serviceTypes"],
    queryFn: () => getServiceTypes(params.agencyId),
  });
  return (
    <section className="flex w-full flex-col">
      <Heading title={params.invId} subTitle="Update invoice." />
      <Card>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <InvoiceForm
            type="update"
            invId={params.invId}
            agencyId={params.agencyId}
          />
        </HydrationBoundary>
      </Card>
    </section>
  );
};
export default UpdateInvoicePage;
