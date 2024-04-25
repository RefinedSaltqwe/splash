import { currentUser } from "@clerk/nextjs";
import React from "react";
import AdminRegistrationForm from "../_components/form/AdminRegistrationForm";
import { db } from "@/server/db";
import UserDetails from "../_components/form/UserDetails";
import Card from "@/app/(dashboard)/_components/containers/Card";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getAuthUserDetails, getUserPermissions } from "@/server/actions/fetch";

type Props = {
  params: { agencyId: string };
};

const SettingsPage = async ({ params }: Props) => {
  const authUser = await currentUser();
  if (!authUser) return null;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["getAuthUserDetails"],
    queryFn: () => getAuthUserDetails(),
  });
  await queryClient.prefetchQuery({
    queryKey: ["getUserPermissions", authUser.id],
    queryFn: () => getUserPermissions(authUser.id),
  });

  const userDetails = await db.user.findUnique({
    where: {
      email: authUser.emailAddresses[0]!.emailAddress,
    },
  });

  if (!userDetails) return null;
  const agencyDetails = await db.agency.findUnique({
    where: {
      id: params.agencyId,
    },
    include: {
      SubAccount: true,
    },
  });

  if (!agencyDetails) return null;

  const subAccounts = agencyDetails.SubAccount;

  return (
    <div className="flex flex-col gap-4 lg:!flex-row">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <AdminRegistrationForm data={agencyDetails} />
        <Card>
          <UserDetails
            type="agency"
            id={authUser.id}
            subAccounts={subAccounts}
            userData={userDetails}
          />
        </Card>
      </HydrationBoundary>
    </div>
  );
};

export default SettingsPage;
