import Card from "@/app/(dashboard)/_components/containers/Card";
import Heading from "@/components/shared/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { convertInvoiceStatus, convertStatusToColor } from "@/lib/utils";
import { getCustomer, getInvoiceWithServices } from "@/server/actions/fetch";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { Download } from "lucide-react";
import React from "react";
import Head from "./_components/Head";
import HeadClient from "./_components/HeadClient";
import RightCardDetails from "./_components/RightCardDetails";
import { TableInvoice } from "./_components/Table";

type InvoiceDetailsPageProps = {
  params: {
    invId: string;
  };
};

const InvoiceDetailsPage: React.FC<InvoiceDetailsPageProps> = async ({
  params,
}) => {
  const invID = params.invId;
  const invoiceWithServices = await getInvoiceWithServices(invID);
  const color = convertStatusToColor(invoiceWithServices!.status);
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
          <div className="col-span-3 lg:col-span-2 ">
            <Card padding={false}>
              <div className="flex w-full flex-col p-10">
                {/* First */}
                <div className="flex w-full flex-row justify-between">
                  <div>Logo</div>
                  <div className="flex flex-col items-end space-y-2 text-center">
                    <div
                      className={`flex flex-row rounded-lg bg-${color}-500/20 px-3 py-1`}
                    >
                      <span
                        className={`text-sm font-semibold text-${color}-500`}
                      >
                        {invoiceWithServices
                          ? convertInvoiceStatus(invoiceWithServices.status)
                          : ""}
                      </span>
                    </div>
                    <span>{invID}</span>
                  </div>
                </div>
                {/* Second */}
                <div className="mt-5 flex w-full flex-col space-y-8 md:flex-row md:space-y-0">
                  <Head
                    title="From"
                    name="Splash, Inc."
                    completeAddress="4336 James Hill Road, Regina, Saskatchewna S4W 0R2, Canada"
                    phoneNumber="639 999 9934"
                    dateTitle="Created"
                    date={invoiceWithServices!.createdAt}
                  />
                  <Separator className="m-0 block w-full bg-slate-200 p-0 md:hidden dark:bg-slate-700" />

                  <HeadClient
                    customerId={invoiceWithServices!.customerId}
                    dueDate={invoiceWithServices!.dueDate}
                  />
                </div>

                <div className="mt-10 flex w-full">
                  <TableInvoice data={invoiceWithServices!} />
                </div>
              </div>
            </Card>
          </div>
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
