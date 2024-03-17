import Card from "@/app/(dashboard)/_components/containers/Card";
import { getFunnel, getFunnels } from "@/server/actions/fetch";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import ClientData from "./_components/ClientData";
import { getSubaccountDetails } from "@/server/queries";

type Props = {
  params: { funnelId: string; subaccountId: string };
};

const FunnelPage = async ({ params }: Props) => {
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
