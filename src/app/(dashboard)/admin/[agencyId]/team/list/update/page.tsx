import Card from "@/app/(dashboard)/_components/containers/Card";
import React from "react";
import Heading from "@/components/shared/Heading";
import InputForm from "../_components/InputForm";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import {
  getAgencyByIdWithSubAccounts,
  getUserById,
  getUserPermissions,
} from "@/server/actions/fetch";

type UpdateUserProps = {
  params: {
    uid: string;
    agencyId: string;
  };
};

const UpdateUser: React.FC<UpdateUserProps> = async ({ params }) => {
  const uid = params.uid;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["user", uid],
    queryFn: () => getUserById(uid),
  });
  await queryClient.prefetchQuery({
    queryKey: ["getUserPermissions", uid],
    queryFn: () => getUserPermissions(uid),
  });
  await queryClient.prefetchQuery({
    queryKey: ["agencyWithSubAccount", uid],
    queryFn: () => getAgencyByIdWithSubAccounts(params.agencyId),
  });
  return (
    <section className="flex w-full flex-col">
      <Heading title="Update" subTitle="Update user" />
      <Card>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <InputForm uid={uid} />
        </HydrationBoundary>
      </Card>
    </section>
  );
};

export default UpdateUser;
