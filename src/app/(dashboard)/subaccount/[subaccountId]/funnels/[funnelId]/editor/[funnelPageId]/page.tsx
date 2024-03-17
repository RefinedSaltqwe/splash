import { getFunnelPageDetails } from "@/server/actions/fetch";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import ClientData from "./_components/ClientData";

type Props = {
  params: {
    subaccountId: string;
    funnelId: string;
    funnelPageId: string;
  };
};

const Page = async ({ params }: Props) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["funnelPage", params.funnelPageId],
    queryFn: () => getFunnelPageDetails(params.funnelPageId),
  });

  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 z-[100] overflow-hidden bg-background">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ClientData
          subaccountId={params.subaccountId}
          funnelId={params.funnelId}
          funnelPageId={params.funnelPageId}
        />
      </HydrationBoundary>
    </div>
  );
};

export default Page;
