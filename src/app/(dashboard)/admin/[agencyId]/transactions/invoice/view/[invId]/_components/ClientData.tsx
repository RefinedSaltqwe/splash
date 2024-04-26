"use client";
import { Button } from "@/components/ui/button";
import { type InvoiceWithServiceAndPaymentAndAgency } from "@/types/prisma";
import { Download } from "lucide-react";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import ContentToPrint from "./ContentToPrint";
import RightCardDetails from "./RightCardDetails";
import Card from "@/app/(dashboard)/_components/containers/Card";

type ClientDataProps = {
  invoiceWithServices: InvoiceWithServiceAndPaymentAndAgency | null | undefined;
  invID: string;
};

const ClientData: React.FC<ClientDataProps> = ({
  invoiceWithServices,
  invID,
}) => {
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  return (
    <div className="grid grid-cols-3 gap-6">
      <ContentToPrint
        invID={invID}
        invoiceWithServices={invoiceWithServices}
        componentRef={componentRef}
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
            <RightCardDetails customerId={invoiceWithServices!.customerId} />
            <div className="flex w-full p-5">
              <Button
                variant={"ghost"}
                className="w-full hover:bg-transparent"
                onClick={handlePrint}
              >
                Download or print receipt{" "}
                <Download className="ml-3" size={20} />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
export default ClientData;
