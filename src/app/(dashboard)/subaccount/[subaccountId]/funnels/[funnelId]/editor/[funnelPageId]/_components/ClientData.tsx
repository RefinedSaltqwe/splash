"use client";
import EditorProvider from "@/components/providers/EditorProvider";
import { getFunnelPageDetails } from "@/server/actions/fetch";
import { type FunnelPage } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import React, { useState } from "react";
import FunnelEditorNavigation from "./FunnelEditorNavigation";
import FunnelEditor from "./funnel-editor";
import FunnelEditorSidebar from "./funnel-editor-sidebar";

type ClientDataProps = {
  subaccountId: string;
  funnelId: string;
  funnelPageId: string;
};

const ClientData: React.FC<ClientDataProps> = ({
  subaccountId,
  funnelId,
  funnelPageId,
}) => {
  const { data: funnelPageDetails } = useQuery({
    queryKey: ["funnelPage", funnelPageId],
    queryFn: () => getFunnelPageDetails(funnelPageId),
  });

  if (!funnelPageDetails) {
    return redirect(`/subaccount/${subaccountId}/funnels/${funnelId}`);
  }

  const [funnelPage, setFunnelPage] = useState<FunnelPage>(funnelPageDetails);
  return (
    <>
      <EditorProvider
        subaccountId={subaccountId}
        funnelId={funnelId}
        pageDetails={funnelPage}
      >
        <FunnelEditorNavigation
          funnelId={funnelId}
          funnelPageDetails={funnelPage}
          subaccountId={subaccountId}
          setFunnelPage={setFunnelPage}
        />
        <div className="flex h-full w-full flex-row">
          <div className="flex h-full grow justify-center">
            <FunnelEditor
              funnelPageId={funnelPageId}
              funnelPageDetails={funnelPageDetails}
            />
          </div>

          <div className="z-[50] flex flex-col">
            <FunnelEditorSidebar
              subaccountId={subaccountId}
              funnelId={funnelId}
            />
          </div>
        </div>
      </EditorProvider>
    </>
  );
};
export default ClientData;
