import ClientButtonLink from "@/app/(dashboard)/_components/ButtonLinks/ClientButtonLink";
import Card from "@/app/(dashboard)/_components/containers/Card";
import Heading from "@/components/shared/Heading";
import { getData } from "@/lib/utils";
import { getAllUsersInAgency } from "@/server/actions/fetch";
import { currentUser } from "@clerk/nextjs";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import React from "react";
import { ClientData } from "./_components/ClientData";
import { columns } from "./_components/Columns";
type EmployeeListPageProps = {
  params: { agencyId: string };
};
const EmployeeListPage: React.FC<EmployeeListPageProps> = async ({
  params,
}) => {
  const tempUser = getData();
  const userSession = currentUser();
  const [user, session] = await Promise.all([tempUser, userSession]);

  const uid = session?.id;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["getAllUsersInAgency"],
    queryFn: () => getAllUsersInAgency(params.agencyId),
  });

  return (
    <section className="flex w-full flex-col">
      <div className="flex items-center justify-between">
        <Heading title="List" />
        <ClientButtonLink
          buttonName="Add User"
          href={`/admin/${params.agencyId}/team/list/create`}
          variant={"secondary"}
        />
      </div>

      <Card padding={false}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ClientData
            columns={columns}
            tempUsers={user}
            uid={uid ? uid : ""}
            agencyId={params.agencyId}
          />
        </HydrationBoundary>
      </Card>
    </section>
  );
};

export default EmployeeListPage;
