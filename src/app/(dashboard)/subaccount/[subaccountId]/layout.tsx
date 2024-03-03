import MobileSidebar from "@/components/modal/MobileSidebar";
import DashboardWrapper from "@/components/shared/DashboardWrapper";
import Header from "@/components/shared/Header";
import Sidebar from "@/components/shared/Sidebar";
import Unauthorized from "@/components/shared/Unauthorized";
import { getAuthUserDetails } from "@/server/actions/fetch";
import {
  getNotificationAndUser,
  verifyAndAcceptInvitation,
} from "@/server/queries";
import { type GetAuthUserDetails } from "@/types/prisma";
import { type NotificationWithUser } from "@/types/stripe";
import { currentUser } from "@clerk/nextjs";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";
import React from "react";

type SubaccountLayoutProps = {
  children: React.ReactNode;
  params: { subaccountId: string };
};

const SubaccountLayout = async ({
  children,
  params,
}: SubaccountLayoutProps) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["getAuthUserDetails"],
    queryFn: () => getAuthUserDetails(),
  });
  const agencyId = await verifyAndAcceptInvitation();
  if (!agencyId) return <Unauthorized />;
  const user = await currentUser();
  if (!user) {
    return redirect("/");
  }

  let notifications: NotificationWithUser = [];
  let myInfo: GetAuthUserDetails;
  if (!user.privateMetadata.role) {
    return <Unauthorized />;
  } else {
    const allPermissions = await getAuthUserDetails();
    const hasPermission = allPermissions?.Permissions.find(
      (permissions) =>
        permissions.access && permissions.subAccountId === params.subaccountId,
    );
    myInfo = allPermissions;
    if (!hasPermission) {
      return <Unauthorized />;
    }

    const allNotifications = await getNotificationAndUser(agencyId);

    if (
      user.privateMetadata.role === "AGENCY_ADMIN" ||
      user.privateMetadata.role === "AGENCY_OWNER"
    ) {
      notifications = allNotifications;
    } else {
      const filteredNoti = allNotifications?.filter(
        (item) => item.subAccountId === params.subaccountId,
      );
      if (filteredNoti) notifications = filteredNoti;
    }
  }

  return (
    <div className="flex h-full">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="fixed bottom-0 top-0 z-50 hidden w-72 border-r-[1.5px] border-dashed border-slate-200 bg-background md:block dark:border-muted">
          <Sidebar id={params.subaccountId} type="subaccount" />
          <MobileSidebar id={params.subaccountId} type="subaccount" />
        </div>
        <div className="flex w-full flex-1 flex-col">
          <div className="fixed left-auto right-0 top-0 z-50 flex w-full md:w-[calc(100%-288px)]">
            <Header notifications={notifications} role={myInfo?.role} />
          </div>
          <main className="flex h-auto w-full flex-1 bg-background">
            <DashboardWrapper
              subaccountId={params.subaccountId}
              agencyId={agencyId}
            >
              {children}
            </DashboardWrapper>
          </main>
        </div>
      </HydrationBoundary>
    </div>
  );
};

export default SubaccountLayout;
