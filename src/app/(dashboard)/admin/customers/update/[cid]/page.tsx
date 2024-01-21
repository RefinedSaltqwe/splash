import Card from "@/app/(dashboard)/_components/containers/Card";
import Heading from "@/components/shared/Heading";
import React from "react";
import UpdateForm from "../_components/UpdateForm";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getCustomer } from "@/server/actions/fetch";

type UpdateUserPageProps = {
  params: {
    cid: string;
  };
};

const UpdateUserPage: React.FC<UpdateUserPageProps> = async ({ params }) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["customer-", params.cid],
    queryFn: () => getCustomer(params.cid),
  });
  return (
    <section className="flex w-full flex-col">
      <Heading title="Update" subTitle="Update customer" />
      <Card>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <UpdateForm cid={params.cid} />
        </HydrationBoundary>
      </Card>
    </section>
  );
};

export default UpdateUserPage;
