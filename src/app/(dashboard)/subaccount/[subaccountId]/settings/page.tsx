import {
  getAgencyByIdWithSubAccounts,
  getUserByEmail,
} from "@/server/actions/fetch";
import { db } from "@/server/db";
import { currentUser } from "@clerk/nextjs";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import ClientData from "./_components/ClientData";
import { type SubAccount } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const subAccounts: SubAccount[] = await db.subAccount.findMany();
  return subAccounts.map(({ id }) => {
    subaccountId: id.toString();
  });
}

type SubaccountSettingPageProps = {
  params: { subaccountId: string };
};

const SubaccountSettingPage = async ({
  params,
}: SubaccountSettingPageProps) => {
  const authUser = await currentUser();
  const queryClient = new QueryClient();
  if (!authUser) return;

  const subAccount = await db.subAccount.findUnique({
    where: { id: params.subaccountId },
  });
  if (!subAccount) return;
  //userDetails
  await queryClient.prefetchQuery({
    queryKey: ["GetUserByEmail", authUser.emailAddresses[0]?.emailAddress],
    queryFn: () =>
      getUserByEmail(authUser.emailAddresses[0]?.emailAddress ?? ""),
  });
  await queryClient.prefetchQuery({
    queryKey: ["agencyWithSubAccount", params.subaccountId],
    queryFn: () => getAgencyByIdWithSubAccounts(subAccount?.agencyId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientData
        emailAddress={authUser.emailAddresses[0]?.emailAddress ?? ""}
        subAccount={subAccount}
        subaccountId={params.subaccountId}
      />
    </HydrationBoundary>
  );
};

export default SubaccountSettingPage;
