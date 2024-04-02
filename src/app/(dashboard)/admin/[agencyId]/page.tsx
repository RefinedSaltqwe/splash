"use server";
import TotalCard from "@/components/analytics/TotalCard";
import CircleProgress from "@/components/shared/CircleProgress";
import GridColumn from "@/components/shared/GridColumn";
import GridWrapper from "@/components/shared/GridWrapper";
import Heading from "@/components/shared/Heading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { stripe } from "@/lib/stripe";
import { db } from "@/server/db";
import { currentUser } from "@clerk/nextjs";
import { type Agency, type SubAccount } from "@prisma/client";
import { AreaChart } from "@tremor/react";
import {
  CircleDollarSign,
  ClipboardIcon,
  ShoppingCart,
  Users,
} from "lucide-react";
import Link from "next/link";

// export async function generateStaticParams() {
//   const agencies: Agency[] = await db.agency.findMany();
//   return agencies.map(({ id }) => {
//     id;
//   });
// }

const AgencyPage = async ({
  params,
}: {
  params: { agencyId: string };
  searchParams: { code: string };
}) => {
  let currency = "USD";
  let sessions;
  const session = await currentUser();
  let totalClosedSessions;
  let totalPendingSessions;
  let net = 0;
  let potentialIncome = 0;
  let closingRate = 0;
  const currentYear: number = new Date().getFullYear();
  const startDate: number =
    new Date(`${currentYear}-01-01T00:00:00Z`).getTime() / 1000;
  const endDate: number =
    new Date(`${currentYear}-12-31T23:59:59Z`).getTime() / 1000;

  const agencyDetails: Agency | null = await db.agency.findUnique({
    where: {
      id: params.agencyId,
    },
  });

  if (!agencyDetails) return;

  const subaccounts: SubAccount[] | null = await db.subAccount.findMany({
    where: {
      agencyId: params.agencyId,
    },
  });

  if (agencyDetails.connectAccountId) {
    const response = await stripe.accounts.retrieve({
      stripeAccount: agencyDetails.connectAccountId,
    });

    currency = response.default_currency?.toUpperCase() ?? "USD";
    const checkoutSessions = await stripe.checkout.sessions.list(
      {
        created: { gte: startDate, lte: endDate },
        limit: 100,
      },
      { stripeAccount: agencyDetails.connectAccountId },
    );
    sessions = checkoutSessions.data;
    totalClosedSessions = checkoutSessions.data
      .filter((session) => session.status === "complete")
      .map((session) => ({
        ...session,
        created: new Date(session.created).toLocaleDateString(),
        amount_total: session.amount_total ? session.amount_total / 100 : 0,
      }));

    totalPendingSessions = checkoutSessions.data
      .filter((session) => session.status === "open")
      .map((session) => ({
        ...session,
        created: new Date(session.created).toLocaleDateString(),
        amount_total: session.amount_total ? session.amount_total / 100 : 0,
      }));
    net = +totalClosedSessions
      .reduce((total, session) => total + (session.amount_total || 0), 0)
      .toFixed(2);

    potentialIncome = +totalPendingSessions
      .reduce((total, session) => total + (session.amount_total || 0), 0)
      .toFixed(2);

    closingRate = +(
      (totalClosedSessions.length / checkoutSessions.data.length) *
      100
    ).toFixed(2);
  }

  return (
    <div className="relative h-full w-full">
      {!agencyDetails.connectAccountId && (
        <div className="absolute -left-10 -top-10 bottom-0 right-0 z-30 flex items-center justify-center bg-background/50 backdrop-blur-md">
          <Card>
            <CardHeader>
              <CardTitle>Connect Your Stripe</CardTitle>
              <CardDescription>
                You need to connect your stripe account to see metrics
              </CardDescription>
              <Link
                href={`/admin/${agencyDetails.id}/launchpad`}
                className="flex w-fit items-center gap-2 rounded-md bg-secondary p-2 text-white"
              >
                <ClipboardIcon />
                Launch Pad
              </Link>
            </CardHeader>
          </Card>
        </div>
      )}
      <Heading
        title={`Hi ${session?.firstName}, welcome back!`}
        subTitle="Dashboard"
      />
      <div className="flex flex-col gap-4 pb-6">
        <GridWrapper>
          <GridColumn colSpan="lg:col-span-3" syncHeight={true}>
            <TotalCard
              title={`Income (${currentYear})`}
              Icon={CircleDollarSign}
              value={net ? `${currency} ${net.toFixed(2)}` : `$0.00`}
              description="Total revenue generated as reflected in your stripe dashboard."
            />
          </GridColumn>
          <GridColumn colSpan="lg:col-span-3" syncHeight={true}>
            <TotalCard
              title={`Potential Income (${currentYear})`}
              Icon={CircleDollarSign}
              value={
                potentialIncome
                  ? `${currency} ${potentialIncome.toFixed(2)}`
                  : `$0.00`
              }
              description="This is how much you can close."
            />
          </GridColumn>
          <GridColumn colSpan="lg:col-span-3" syncHeight={true}>
            <TotalCard
              title={`Active Clients`}
              Icon={Users}
              value={subaccounts.length.toString()}
              description="Reflects the number of sub accounts you own and manage."
            />
          </GridColumn>
          <GridColumn colSpan="lg:col-span-3" syncHeight={true}>
            <TotalCard
              title={`Agency Goal`}
              description="Reflects the number of sub accounts you own and manage."
            >
              <div className="flex w-full flex-col">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-normal text-muted-foreground">
                    Current: {subaccounts.length}
                  </span>
                  <span className="text-sm font-normal text-muted-foreground">
                    Goal: {agencyDetails.goal}
                  </span>
                </div>
                <Progress
                  value={(subaccounts.length / agencyDetails.goal) * 100}
                />
              </div>
            </TotalCard>
          </GridColumn>
        </GridWrapper>

        <div className="flex flex-col gap-4 xl:!flex-row">
          <Card className="flex-1 p-4">
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <AreaChart
              className="stroke-primary text-sm"
              data={[
                ...(totalClosedSessions ?? []),
                ...(totalPendingSessions ?? []),
              ]}
              index="created"
              categories={["amount_total"]}
              colors={["primary"]}
              yAxisWidth={30}
              showAnimation={true}
            />
          </Card>
          <Card className="w-full xl:w-[400px]">
            <CardHeader>
              <CardTitle>Conversions</CardTitle>
            </CardHeader>
            <CardContent>
              <CircleProgress
                value={closingRate}
                description={
                  <>
                    {sessions && (
                      <span className="flex flex-col">
                        Abandoned
                        <span className="flex gap-2">
                          <ShoppingCart className="text-rose-700" />
                          {sessions.length}
                        </span>
                      </span>
                    )}
                    {totalClosedSessions && (
                      <span className="felx flex-col">
                        Won Carts
                        <span className="flex gap-2">
                          <ShoppingCart className="text-emerald-700" />
                          {totalClosedSessions.length}
                        </span>
                      </span>
                    )}
                  </>
                }
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AgencyPage;
