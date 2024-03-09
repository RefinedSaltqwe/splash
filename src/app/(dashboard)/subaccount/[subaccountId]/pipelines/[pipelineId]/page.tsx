import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getContacts,
  getLanesWithTicketAndTags,
  getPipelineDetails,
  getSubAccountTeamMembers,
  getTagsForSubaccount,
} from "@/server/actions/fetch";
import { db } from "@/server/db";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";
import PipelineInfoBar from "../_components/PipelineInfoBar";
import PipelineSettings from "../_components/PipelineSettings";
import PipelineView from "../_components/PipelineView";

type PipelinePageProps = {
  params: { subaccountId: string; pipelineId: string };
};

const PipelinePage = async ({ params }: PipelinePageProps) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["TagsForSubaccount", params.subaccountId],
    queryFn: () => getTagsForSubaccount(params.subaccountId),
  });
  await queryClient.prefetchQuery({
    queryKey: ["lanes", params.pipelineId],
    queryFn: () => getLanesWithTicketAndTags(params.pipelineId),
  });
  await queryClient.prefetchQuery({
    queryKey: ["SubAccountTeamMembers", params.subaccountId],
    queryFn: () => getSubAccountTeamMembers(params.subaccountId),
  });
  await queryClient.prefetchQuery({
    queryKey: ["ContactList", params.subaccountId],
    queryFn: () => getContacts(),
  });
  const pipelineDetails = await getPipelineDetails(params.pipelineId);
  if (!pipelineDetails) {
    return redirect(`/subaccount/${params.subaccountId}/pipelines`);
  }

  const pipelines = await db.pipeline.findMany({
    where: { subAccountId: params.subaccountId },
  });

  return (
    <Tabs defaultValue="view" className="w-full">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TabsList className="mb-4 h-16 w-full justify-between border-b-2 bg-transparent">
          <PipelineInfoBar
            pipelineId={params.pipelineId}
            subAccountId={params.subaccountId}
            pipelines={pipelines}
          />
          <div>
            <TabsTrigger value="view">Pipeline View</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </div>
        </TabsList>
        <TabsContent value="view">
          <PipelineView
            pipelineDetails={pipelineDetails}
            pipelineId={params.pipelineId}
            subaccountId={params.subaccountId}
          />
        </TabsContent>
        <TabsContent value="settings">
          <PipelineSettings
            pipelineId={params.pipelineId}
            pipelines={pipelines}
            subaccountId={params.subaccountId}
          />
        </TabsContent>
      </HydrationBoundary>
    </Tabs>
  );
};

export default PipelinePage;
