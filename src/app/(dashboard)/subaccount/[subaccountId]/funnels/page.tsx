import Card from "@/app/(dashboard)/_components/containers/Card";
import { getFunnels } from "@/server/actions/fetch";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import ClientData from "./_components/ClientData";

const Funnels = async ({ params }: { params: { subaccountId: string } }) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["funnels", params.subaccountId],
    queryFn: () => getFunnels(params.subaccountId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Card padding={false}>
        <ClientData subaccountId={params.subaccountId} />
      </Card>
    </HydrationBoundary>
  );
};

export default Funnels;
