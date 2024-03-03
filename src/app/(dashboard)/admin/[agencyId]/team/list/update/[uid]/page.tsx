import Card from "@/app/(dashboard)/_components/containers/Card";
import Heading from "@/components/shared/Heading";
import React from "react";
import InputForm from "../../_components/InputForm";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getUserById } from "@/server/actions/fetch";

type UpdateUserProps = {
  params: {
    uid: string;
  };
};

const UpdateUser: React.FC<UpdateUserProps> = async ({ params }) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["user", params.uid],
    queryFn: () => getUserById(params.uid),
  });
  return (
    <section className="flex w-full flex-col">
      <Heading title="Update" subTitle="Update user infomration" />
      <Card>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <InputForm uid={params.uid} />
        </HydrationBoundary>
      </Card>
    </section>
  );
};

export default UpdateUser;
