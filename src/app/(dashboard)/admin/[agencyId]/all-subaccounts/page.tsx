import { getAuthUserDetails } from "@/server/actions/fetch";
import ClientData from "./_components/ClientData";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

type Props = {
  params: { agencyId: string };
};

const AllSubaccountsPage = async ({ params }: Props) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["getAuthUserDetails"],
    queryFn: () => getAuthUserDetails(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientData agencyId={params.agencyId} />
    </HydrationBoundary>
  );
};

export default AllSubaccountsPage;
