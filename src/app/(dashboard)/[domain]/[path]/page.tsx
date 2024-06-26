import EditorProvider from "@/components/providers/EditorProvider";
import { notFound } from "next/navigation";
import React from "react";
import FunnelEditor from "../../subaccount/[subaccountId]/funnels/[funnelId]/editor/[funnelPageId]/_components/funnel-editor";
import { getDomainContent, getFunnelPageDetails } from "@/server/actions/fetch";

const Page = async ({
  params,
}: {
  params: { domain: string; path: string };
}) => {
  const domainData = await getDomainContent(params.domain.slice(0, -1));
  const pageData = domainData?.FunnelPages.find(
    (page) => page.pathName === params.path,
  );

  const funnelPageDetails = await getFunnelPageDetails(pageData?.id ?? "");
  if (!funnelPageDetails) {
    return notFound();
  }

  if (!pageData || !domainData) return notFound();
  console.log("Path:", funnelPageDetails);
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
