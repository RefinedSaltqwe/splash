import Card from "@/app/(dashboard)/_components/containers/Card";
import Heading from "@/components/shared/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, CreditCard, Download, User } from "lucide-react";
import React from "react";
import Head from "./_components/Head";
import { TableInvoice } from "./_components/Table";

type InvoiceDetailsPageProps = {
  params: {
    invId: string;
  };
};

const InvoiceDetailsPage: React.FC<InvoiceDetailsPageProps> = ({ params }) => {
  const invID = params.invId;
  return (
    <section className="w-full">
      <Heading title={invID} subTitle="Invoice Details" />
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-3 lg:col-span-2 ">
          <Card padding={false}>
            <div className="flex w-full flex-col p-10">
              {/* First */}
              <div className="flex w-full flex-row justify-between">
                <div>Logo</div>
                <div className="flex flex-col items-end space-y-2 text-center">
                  <div className="flex flex-row rounded-lg bg-green-500/20 px-3 py-1">
                    <span className="text-sm font-semibold text-green-500">
                      Paid
                    </span>
                  </div>
                  <span>{invID}</span>
                </div>
              </div>
              {/* Second */}
              <div className="mt-5 flex w-full flex-col space-y-8 md:flex-row md:space-y-0">
                <Head
                  title="Invoice From"
                  name="Splash, Inc."
                  completeAddress="4336 James Hill Road, Regina, Saskatchewna S4W 0R2, Canada"
                  phoneNumber="639 999 9934"
                  dateTitle="Created"
                  date={new Date()}
                />
                <Separator className="m-0 block w-full bg-slate-200 p-0 md:hidden dark:bg-slate-700" />
                <Head
                  title="Invoice To"
                  name="Southland Mall"
                  completeAddress="123 Made Up Street, Regina, Saskatchewn S42 0T2, Canada"
                  phoneNumber="639 913 6193"
                  dateTitle="Due"
                  date={new Date()}
                />
              </div>

              <div className="mt-10 flex w-full">
                <TableInvoice />
              </div>
            </div>
          </Card>
        </div>
        <div className="col-span-3 lg:col-span-1">
          <Card padding={false}>
            <div className="divider-color flex w-full flex-col divide-y divide-solid">
              <div className="flex w-full flex-col space-y-2 p-10">
                <span className="font-normal text-foreground">Amount</span>
                <span className="text-semibold text-foreground">
                  $10,560.00
                </span>
              </div>
              <div className="flex w-full flex-col space-y-2 p-10">
                <div className="flex w-full flex-row items-center space-x-3">
                  <User size={20} className="text-muted-foreground" />
                  <span className="font-normal text-foreground">
                    Alex Logan
                  </span>
                </div>
                <div className="flex w-full flex-row items-center space-x-3">
                  <Calendar size={20} className="text-muted-foreground" />
                  <span className="font-normal text-muted-foreground">
                    January 31, 2023
                  </span>
                </div>
                <div className="flex w-full flex-row items-center space-x-3">
                  <CreditCard size={20} className="text-muted-foreground" />
                  <span className="font-normal text-muted-foreground">
                    Paid with MasterCard
                  </span>
                </div>
              </div>
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
    </section>
  );
};
export default InvoiceDetailsPage;
