import ClientButtonLink from "@/app/(dashboard)/_components/ButtonLinks/ClientButtonLink";
import Card from "@/app/(dashboard)/_components/containers/Card";
import Heading from "@/components/shared/Heading";
import { getData } from "@/lib/utils";
import { getUsersExcludeCurrentUserById } from "@/server/actions/fetch";
import { authOptions } from "@/server/auth";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getServerSession } from "next-auth";
import React from "react";
import { ClientData } from "./_components/ClientData";
import { columns } from "./_components/Columns";

const EmployeeListPage: React.FC = async () => {
  const tempUser = getData();
  const userSession = getServerSession(authOptions);
  const [user, session] = await Promise.all([tempUser, userSession]);

  const uid = session?.user.id;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["usersExcludingCurrentUser"],
    queryFn: () => getUsersExcludeCurrentUserById(uid ? uid : ""),
  });

  return (
    <section className="flex w-full flex-col">
      <div className="flex items-center justify-between">
        <Heading title="List" />
        <ClientButtonLink
          buttonName="Create User"
          href="/admin/employees/list/create"
          variant={"secondary"}
        />
      </div>

      <Card padding={false}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ClientData columns={columns} tempUsers={user} uid={uid ? uid : ""} />
        </HydrationBoundary>
      </Card>
    </section>
  );
};

export default EmployeeListPage;
