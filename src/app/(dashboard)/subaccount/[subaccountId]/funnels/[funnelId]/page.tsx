import Card from "@/app/(dashboard)/_components/containers/Card";
import { getFunnel, getFunnels } from "@/server/actions/fetch";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import ClientData from "./_components/ClientData";
import { getFunnelPages, getSubaccountDetails } from "@/server/queries";
import { type Funnel } from "@prisma/client";
import { db } from "@/server/db";

type FunnelPageProps = {
  params: { funnelId: string; subaccountId: string };
};

export const dynamic = "force-dynamic";

export async function generateStaticParams({ params }: FunnelPageProps) {
  const funnels: Funnel[] = await db.funnel.findMany({
    where: {
      id: params.funnelId,
      subAccountId: params.subaccountId,
    },
  });
  return funnels.map((row) => {
    funnelId: row.id.toString();
    subaccountId: row.subAccountId.toString();
  });
}

const FunnelPage = async ({ params }: FunnelPageProps) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["funnel", params.funnelId],
    queryFn: () => getFunnel(params.funnelId),
  });
  await queryClient.prefetchQuery({
    queryKey: ["funnels", params.subaccountId],
    queryFn: () => getFunnels(params.subaccountId),
  });
  await queryClient.prefetchQuery({
    queryKey: ["subaccount", params.subaccountId],
    queryFn: () => getSubaccountDetails(params.subaccountId),
  });
  await queryClient.prefetchQuery({
    queryKey: ["funnelPages", params.funnelId],
    queryFn: () => getFunnelPages(params.funnelId),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Card>
        <ClientData
          subaccountId={params.subaccountId}
          funnelId={params.funnelId}
        />
      </Card>
    </HydrationBoundary>
  );
};

export default FunnelPage;
