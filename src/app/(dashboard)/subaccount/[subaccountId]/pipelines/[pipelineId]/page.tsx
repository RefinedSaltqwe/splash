import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getContacts,
  getLanesWithTicketAndTags,
  getPipelineDetails,
  getPipelinesOnly,
  getSubAccountTeamMembers,
  getTagsForSubaccount,
} from "@/server/actions/fetch";
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
import { db } from "@/server/db";

type PipelinePageProps = {
  params: { subaccountId: string; pipelineId: string };
};

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const pipelines: Pipeline[] = await db.pipeline.findMany();
  return pipelines.map((row) => {
    subaccountId: row.subAccountId.toString();
    pipelineId: row.id.toString();
  });
}

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
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Tabs defaultValue="project_task" className="w-full p-4">
        <TabsList className="grid w-full grid-cols-3 lg:w-[50%]">
          <TabsTrigger
            value="project_task"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Projects/Tasks
          </TabsTrigger>
          <TabsTrigger
            value="future"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Future
          </TabsTrigger>
          <TabsTrigger
            value="archive"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Archive
          </TabsTrigger>
        </TabsList>
        <TabsContent value="project_task">
          <Tabs defaultValue="view" className="w-full">
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
          </Tabs>
        </TabsContent>
        <TabsContent value="future">Future Projects</TabsContent>
        <TabsContent value="archive">archive</TabsContent>
      </Tabs>
    </HydrationBoundary>
  );
};

export default PipelinePage;
