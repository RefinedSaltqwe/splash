import ClientButtonLink from "@/app/(dashboard)/_components/ButtonLinks/ClientButtonLink";
import Card from "@/app/(dashboard)/_components/containers/Card";
import Heading from "@/components/shared/Heading";
import { type Invoice } from "@/types";
import {
  CalendarCheck,
  CalendarClock,
  CalendarPlus,
  CalendarX2,
  ClipboardList,
} from "lucide-react";
import React from "react";
import { columns } from "./_components/Columns";
import { DataTable } from "./_components/DataTable";
import Stats from "./_components/Stats";
import { cn } from "@/lib/utils";

type InvoicePageProps = object;

async function getData(): Promise<Invoice[]> {
  //? Fetch data from your API here.
  const generatedUsers: Invoice[] = generateRandomUsers(15); // Temporary
  const users = generatedUsers;
  return users;
}
// ! ----------------------------------------------------------TEMPORARY DATA ----------------------
function generateRandomId(): string {
  // You can implement your own logic to generate unique IDs
  return Math.random().toString(36).substring(2, 10);
}

function generateRandomNumber(num: number): number {
  // You can implement your own logic to generate random phone numbers
  return Math.floor(Math.random() * num);
}

function generateDate(): Date {
  const currentDate = new Date();
  return currentDate;
}

const generateRandomUser = (): Invoice => ({
  id: `INV-${generateRandomNumber(100000)}`,
  customerId: generateRandomId(),
  createdAt: generateDate(),
  dueDate: generateDate(),
  payment: generateRandomNumber(100),
  total: 100,
  status:
    generateRandomNumber(4) === 1
      ? "1"
      : generateRandomNumber(4) === 2
        ? "2"
        : generateRandomNumber(4) === 3
          ? "3"
          : "4",
  tax: 0,
  shipping: "Free",
  subTotal: 100,
});

const generateRandomUsers = (count: number): Invoice[] => {
  const users: Invoice[] = [];
  for (let i = 0; i < count; i++) {
    users.push(generateRandomUser());
  }
  return users;
};
// !-----------------------------------------------------------------------------------

const InvoicePage: React.FC<InvoicePageProps> = async () => {
  const data = await getData();
  const getTotalValues = (status: string) => {
    return data.filter((item) => item.status === status).length;
  };
  return (
    <section className="flex w-full flex-col">
      <div className="flex items-center justify-between">
        <Heading title="Invoice" />
        <ClientButtonLink
          buttonName="Create Invoice"
          href="/admin/invoice/create"
          variant={"secondary"}
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
                  numberOfInv={data.length}
                  amount={24232}
                  iconColor="text-slate-800 dark:text-slate-100"
                  iconBackground="bg-slate-300/60 dark:bg-slate-200/40"
                />
                <Stats
                  Icon={CalendarCheck}
                  title="Paid"
                  numberOfInv={getTotalValues("1")}
                  amount={24232}
                  iconColor="text-green-500 "
                  iconBackground="bg-green-500/20"
                />
                <Stats
                  Icon={CalendarPlus}
                  title="Partially Paid"
                  numberOfInv={getTotalValues("2")}
                  amount={24232}
                  iconColor="text-yellow-500 "
                  iconBackground="bg-yellow-500/20"
                />
                <Stats
                  Icon={CalendarClock}
                  title="Unpaid"
                  numberOfInv={getTotalValues("3")}
                  amount={24232}
                  iconColor="text-orange-500 "
                  iconBackground="bg-orange-500/20"
                />
                <Stats
                  Icon={CalendarX2}
                  title="Overdue"
                  numberOfInv={getTotalValues("4")}
                  amount={24232}
                  iconColor="text-red-500 "
                  iconBackground="bg-red-500/20"
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
      <Card padding={false}>
        <DataTable columns={columns} data={data} invoice={data} />
      </Card>
    </section>
  );
};

export default InvoicePage;
