import ClientButtonLink from "@/app/(dashboard)/_components/ButtonLinks/ClientButtonLink";
import Card from "@/app/(dashboard)/_components/containers/Card";
import Heading from "@/components/shared/Heading";
import { cn, generateRandomInvoice, totalValueWithTax } from "@/lib/utils";
import {
  getCustomers,
  getInvoices,
  getServiceTypes,
} from "@/server/actions/fetch";
import { type Invoice } from "@prisma/client";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import {
  CalendarCheck,
  CalendarClock,
  CalendarPlus,
  CalendarX2,
  ClipboardList,
} from "lucide-react";
import React from "react";
import { ClientData } from "./_components/ClientData";
import { columns } from "./_components/Columns";
import Stats from "./_components/Stats";

type InvoicePageProps = {
  params: {
    agencyId: string;
  };
};

export const revalidate = 3600;
const InvoicePage: React.FC<InvoicePageProps> = async ({ params }) => {
  const agencyId = params.agencyId;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["serviceTypes"],
    queryFn: () => getServiceTypes(agencyId),
  });
  await queryClient.prefetchQuery({
    queryKey: ["invoices"],
    queryFn: () => getInvoices(agencyId),
  });

  const randomInvoice: Invoice[] = generateRandomInvoice(1);
  const getInvoicesFrDb = getInvoices(agencyId);
  const getCustomersFrDb = getCustomers(agencyId);

  const [invoicesData, tempData, customersData] = await Promise.all([
    getInvoicesFrDb,
    randomInvoice,
    getCustomersFrDb,
  ]);

  const getTotalValues = (status: string) => {
    return invoicesData
      ? invoicesData?.filter((item) => item.status === status).length
      : 0;
  };

  const statusTotalValues = (id: string) => {
    let total = 0;
    if (id === "total") {
      invoicesData?.forEach((item) => {
        total += item.payment;
      });
      return total;
    } else if (id === "3" || id === "4") {
      const x = invoicesData?.filter((item) => item.status === id);
      x?.forEach((item) => {
        total += totalValueWithTax(
          item.subTotal,
          item.shipping,
          item.discount,
          item.tax,
        );
      });
      return total;
    } else {
      const x = invoicesData?.filter((item) => item.status === id);
      x?.forEach((item) => {
        total += item.payment;
      });
      return total;
    }
  };

  return (
    <section className="flex w-full flex-col">
      <div className="flex items-center justify-between">
        <Heading title="Invoice" />
        <ClientButtonLink
          buttonName="Create Invoice"
          href={`/admin/${agencyId}/transactions/invoice/create`}
          variant={"default"}
        />
      </div>
      <div className="mb-10 w-full">
        <Card padding={false}>
          <div className="splash-scroll-x flex w-full">
            <div className="flex min-w-[1000px] shrink-0 grow">
              <div
                className={cn(
                  "divider-color grid w-full px-5 py-3",
                  "grid-flow-col grid-cols-5 divide-x divide-dashed ",
                )}
              >
                <Stats
                  Icon={ClipboardList}
                  title="Total"
                  numberOfInv={invoicesData ? invoicesData.length : 0}
                  amount={statusTotalValues("total")}
                  iconColor="text-slate-800 dark:text-slate-100"
                  iconBackground="bg-slate-300/60 dark:bg-slate-200/40"
                />
                <Stats
                  Icon={CalendarCheck}
                  title="Paid"
                  numberOfInv={getTotalValues("1")}
                  amount={statusTotalValues("1")}
                  iconColor="text-green-500 "
                  iconBackground="bg-green-500/20"
                />
                <Stats
                  Icon={CalendarPlus}
                  title="Partially Paid"
                  numberOfInv={getTotalValues("2")}
                  amount={statusTotalValues("2")}
                  iconColor="text-yellow-500 "
                  iconBackground="bg-yellow-500/20"
                />
                <Stats
                  Icon={CalendarClock}
                  title="Unpaid"
                  numberOfInv={getTotalValues("3")}
                  amount={statusTotalValues("3")}
                  iconColor="text-orange-500 "
                  iconBackground="bg-orange-500/20"
                />
                <Stats
                  Icon={CalendarX2}
                  title="Overdue"
                  numberOfInv={getTotalValues("4")}
                  amount={statusTotalValues("4")}
                  iconColor="text-red-500 "
                  iconBackground="bg-red-500/20"
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
      <Card padding={false}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ClientData
            columns={columns}
            customersData={customersData!}
            tempData={tempData}
            agencyId={agencyId}
          />
        </HydrationBoundary>
      </Card>
    </section>
  );
};

export default InvoicePage;
