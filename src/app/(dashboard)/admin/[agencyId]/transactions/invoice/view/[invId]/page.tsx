import Card from "@/app/(dashboard)/_components/containers/Card";
import Heading from "@/components/shared/Heading";
import { Button } from "@/components/ui/button";
import { getCustomer, getInvoiceWithServices } from "@/server/actions/fetch";
import { db } from "@/server/db";
import { type Invoice } from "@prisma/client";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { Download } from "lucide-react";
import React from "react";
import ContentToPrint from "./_components/ContentToPrint";
import RightCardDetails from "./_components/RightCardDetails";

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
        <div className="grid grid-cols-3 gap-6">
          <ContentToPrint
            invID={invID}
            invoiceWithServices={invoiceWithServices}
          />
          <div className="col-span-3 lg:col-span-1">
            <Card padding={false}>
              <div className="divider-color flex w-full flex-col divide-y divide-solid">
                <div className="flex w-full flex-col space-y-2 p-10">
                  <span className="font-normal text-foreground">Balance</span>
                  <span className="text-semibold text-foreground">
                    {`$${invoiceWithServices!.total}`}
                  </span>
                </div>
                <RightCardDetails
                  customerId={invoiceWithServices!.customerId}
                />
                <div className="flex w-full p-5">
                  <Button
                    variant={"ghost"}
                    className="w-full hover:bg-transparent"
                  >
                    Download receipt <Download className="ml-3" size={20} />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </HydrationBoundary>
    </section>
  );
};
export default InvoiceDetailsPage;
