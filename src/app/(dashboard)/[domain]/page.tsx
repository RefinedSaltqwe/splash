import EditorProvider from "@/components/providers/editor/EditorProvider";
import { db } from "@/server/db";
import { getDomainContent } from "@/server/queries";
import { notFound } from "next/navigation";
import FunnelEditor from "../subaccount/[subaccountId]/funnels/[funnelId]/editor/[funnelPageId]/_components/funnel-editor";
import { getFunnelPageDetails } from "@/server/actions/fetch";

const Page = async ({ params }: { params: { domain: string } }) => {
  const domainData = await getDomainContent(params.domain.slice(0, -1));
  if (!domainData) return notFound();

  const pageData = domainData.FunnelPages.find((page) => !page.pathName);

  const funnelPageDetails = await getFunnelPageDetails(pageData?.id ?? "");
  if (!funnelPageDetails) {
    return notFound();
  }

  if (!pageData) return notFound();

  await db.funnelPage.update({
    where: {
      id: pageData.id,
    },
    data: {
      visits: {
        increment: 1,
      },
    },
  });

  return (
    <EditorProvider
      subaccountId={domainData.subAccountId}
      pageDetails={pageData}
      funnelId={domainData.id}
    >
      <FunnelEditor
        funnelPageId={pageData.id}
        liveMode={true}
        funnelPageDetails={funnelPageDetails}
      />
    </EditorProvider>
  );
};

export default Page;
