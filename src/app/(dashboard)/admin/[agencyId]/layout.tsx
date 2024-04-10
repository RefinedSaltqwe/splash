"use server";
import MobileSidebar from "@/components/modal/MobileSidebar";
import DashboardWrapper from "@/components/shared/DashboardWrapper";
import Header from "@/components/shared/Header";
import Sidebar from "@/components/shared/Sidebar";
import Unauthorized from "@/components/shared/Unauthorized";
import { getAuthUserDetails } from "@/server/actions/fetch";
import {
  getAgencyIdByLoggedInUser,
  getNotificationAndUser,
} from "@/server/queries";
import { type NotificationWithUser } from "@/types/stripe";
import { currentUser } from "@clerk/nextjs";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";
import React from "react";

type AgencyLayoutProps = {
  children: React.ReactNode;
};

const AgencyLayout: React.FC<AgencyLayoutProps> = async ({ children }) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["getAuthUserDetails"],
    queryFn: () => getAuthUserDetails(),
  });
  const agencyId = await getAgencyIdByLoggedInUser();
  const user = await currentUser();

  if (!user) {
    return redirect("/");
  }

  if (!agencyId) {
    return redirect("/admin");
  }

  if (
    user.privateMetadata.role !== "AGENCY_OWNER" &&
    user.privateMetadata.role !== "AGENCY_ADMIN"
  )
    return <Unauthorized />;

  let allNoti: NotificationWithUser = [];
  const notifications = await getNotificationAndUser(agencyId);
  if (notifications) allNoti = notifications;
  return (
    <div className="flex h-full">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="fixed bottom-0 top-0 z-50 hidden w-72 border-r-[1.5px] border-dashed border-slate-200 bg-background md:block dark:border-muted">
          <Sidebar id={agencyId} type="agency" />
          <MobileSidebar id={agencyId} type="agency" />
        </div>
        <div className="flex w-full flex-1 flex-col">
          <div className="fixed left-auto right-0 top-0 z-50 flex w-full md:w-[calc(100%-288px)]">
            <Header notifications={allNoti} role={user.privateMetadata.role} />
          </div>
          <main className="flex h-auto w-full flex-1 bg-background">
            <DashboardWrapper agencyId={agencyId}>{children}</DashboardWrapper>
          </main>
        </div>
      </HydrationBoundary>
    </div>
  );
};

export default AgencyLayout;
