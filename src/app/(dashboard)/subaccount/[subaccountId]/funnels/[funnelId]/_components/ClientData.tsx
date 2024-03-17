"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getFunnel } from "@/server/actions/fetch";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import FunnelSteps from "./FunnelSteps";
import FunnelSettings from "./FunnelSettings";

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
      <h1 className="mb-8 text-3xl">{funnelPages.name}</h1>
      <Tabs defaultValue="steps" className="w-full">
        <TabsList className="grid  w-[50%] grid-cols-2 bg-transparent ">
          <TabsTrigger value="steps">Steps</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
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
