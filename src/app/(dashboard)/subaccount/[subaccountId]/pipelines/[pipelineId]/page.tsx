import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getContacts,
  getLanesWithTicketAndTags,
  getPipelineDetails,
  getPipelinesOnly,
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
import { type Pipeline } from "@prisma/client";

export async function generateStaticParams() {
  const pipelines: Pipeline[] = await db.pipeline.findMany();
  return pipelines.map(({ id }) => {
    pipelineId: id;
  });
}

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
  await queryClient.prefetchQuery({
    queryKey: ["pipelines", params.subaccountId],
    queryFn: () => getPipelinesOnly(params.subaccountId),
  });
  const pipelineDetails = await getPipelineDetails(params.pipelineId);
  if (!pipelineDetails) {
    return redirect(`/subaccount/${params.subaccountId}/pipelines`);
  }

  return (
    <Tabs defaultValue="view" className="w-full">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TabsList className="splash-border-color mb-4 h-16 w-full justify-between rounded-none border-b-[1px] bg-transparent">
          <PipelineInfoBar
            pipelineId={params.pipelineId}
            subAccountId={params.subaccountId}
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
            subaccountId={params.subaccountId}
          />
        </TabsContent>
      </HydrationBoundary>
    </Tabs>
  );
};

export default PipelinePage;
