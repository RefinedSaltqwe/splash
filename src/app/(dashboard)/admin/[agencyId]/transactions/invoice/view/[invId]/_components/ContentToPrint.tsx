"use client";
import { Separator } from "@/components/ui/separator";
import { convertInvoiceStatus, convertStatusToColor } from "@/lib/utils";
import { type InvoiceWithServiceAndPayment } from "@/types/prisma";
import React, { useRef } from "react";
import HeadClient from "./HeadClient";
import { TableInvoice } from "./Table";
import Card from "@/app/(dashboard)/_components/containers/Card";
import Head from "./Head";
import { Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { useCurrentUserStore } from "@/stores/useCurrentUser";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";

type ContentToPrintProps = {
  invoiceWithServices: InvoiceWithServiceAndPayment | null | undefined;
  invID: string;
};

const ContentToPrint: React.FC<ContentToPrintProps> = ({
  invoiceWithServices,
  invID,
}) => {
  const color = convertStatusToColor(invoiceWithServices!.status);
  const logo = useCurrentUserStore((state) => state.agencyData?.agencyLogo);
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  return (
    <div className="col-span-3 lg:col-span-2 ">
      <Card padding={false}>
        <div className="flex w-full flex-col">
          <div className="mt-5 flex w-full items-center justify-end pr-5">
            <Button
              onClick={handlePrint}
              className="rounded-full text-foreground"
              variant={"ghost"}
              size={"icon"}
            >
              <Printer className="text-muted-foreground" size={18} />
            </Button>
          </div>
          <div className="flex w-full flex-col p-10" ref={componentRef}>
            {/* First */}
            <div className="flex w-full flex-row justify-between">
              <div className="flex w-[150px]">
                <AspectRatio ratio={16 / 4}>
                  <Image
                    src={logo ?? ""}
                    alt="Sidebar Logo"
                    fill
                    sizes="(max-width: 368px) 100vw, (max-width: 700px) 50vw, 33vw"
                    className="rounded-md object-contain"
                  />
                </AspectRatio>
              </div>

              <div className="flex flex-col items-end space-y-2 text-center">
                <div
                  className={`flex flex-row rounded-lg bg-${color}-500/20 px-3 py-1`}
                >
                  <span className={`text-sm font-semibold text-${color}-500`}>
                    {invoiceWithServices
                      ? convertInvoiceStatus(invoiceWithServices.status)
                      : ""}
                  </span>
                </div>
                <span>{invID}</span>
              </div>
            </div>
            {/* Second */}
            <div className="mt-5 flex w-full flex-col space-y-2 md:flex-row md:space-y-0">
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

            <div className="mt-2 flex w-full md:mt-10">
              <TableInvoice data={invoiceWithServices!} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
export default ContentToPrint;
