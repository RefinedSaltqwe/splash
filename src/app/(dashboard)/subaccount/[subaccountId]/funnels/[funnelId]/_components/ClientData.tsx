"use client";
import Heading from "@/components/shared/Heading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getFunnel } from "@/server/actions/fetch";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import FunnelSettings from "./FunnelSettings";
import FunnelSteps from "./FunnelSteps";

type ClientDataProps = {
  subaccountId: string;
  funnelId: string;
};

const ClientData: React.FC<ClientDataProps> = ({ subaccountId, funnelId }) => {
  const { data: funnelPages } = useQuery({
    queryKey: ["funnel", funnelId],
    queryFn: () => getFunnel(funnelId),
  });

  if (!funnelPages) {
    return redirect(`/subaccount/${subaccountId}/funnels`);
  }
  return (
    <div className="flex w-full flex-col">
      <Link
        href={`/subaccount/${subaccountId}/funnels`}
        className="mb-4 flex justify-between gap-4 text-muted-foreground"
      >
        Back
      </Link>
      <Heading title={funnelPages.name} />
      <Tabs defaultValue="steps" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-background dark:bg-background/20">
          <TabsTrigger
            value="steps"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Steps
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Settings
          </TabsTrigger>
        </TabsList>
        <TabsContent value="steps">
          <FunnelSteps
            funnel={funnelPages}
            subaccountId={subaccountId}
            pages={funnelPages.FunnelPages}
            funnelId={funnelId}
          />
        </TabsContent>
        <TabsContent value="settings">
          <FunnelSettings
            subaccountId={subaccountId}
            defaultData={funnelPages}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default ClientData;
