import Card from "@/app/(dashboard)/_components/containers/Card";
import Heading from "@/components/shared/Heading";
import { getSupplierById } from "@/server/actions/fetch";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import React from "react";
import InputForm from "../../_components/InputForm";

type UpdateSupplierPageProps = {
  params: {
    sid: string;
  };
};

const UpdateSupplierPage: React.FC<UpdateSupplierPageProps> = async ({
  params,
}) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["supplier-", params.sid],
    queryFn: () => getSupplierById(params.sid),
  });
  return (
    <section className="flex w-full flex-col">
      <Heading title="Update" subTitle="Update supplier" />
      <Card>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <InputForm sid={params.sid} type="update" />
        </HydrationBoundary>
      </Card>
    </section>
  );
};

export default UpdateSupplierPage;
