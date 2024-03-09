import { getMedia } from "@/server/actions/fetch";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import React from "react";
import MediaComponent from "./_components/Media";

type Props = {
  params: { subaccountId: string };
};

const MediaPage = async ({ params }: Props) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["media", params.subaccountId],
    queryFn: () => getMedia(params.subaccountId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MediaComponent subaccountId={params.subaccountId} />
    </HydrationBoundary>
  );
};

export default MediaPage;
