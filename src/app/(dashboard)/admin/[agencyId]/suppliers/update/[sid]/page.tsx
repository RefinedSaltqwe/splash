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
import { db } from "@/server/db";

type UpdateSupplierPageProps = {
  params: {
    sid: string;
    agencyId: string;
  };
};

export const dynamic = "force-dynamic";

export async function generateStaticParams({
  params,
}: UpdateSupplierPageProps) {
  const suppliers = await db.supplier.findMany({
    where: {
      Agency: {
        id: params.agencyId,
      },
    },
  });
  return suppliers.map((row) => {
    agencyId: row.agencyId.toString();
    sid: row.id.toString();
  });
}

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
          <InputForm
            sid={params.sid}
            type="update"
            agencyId={params.agencyId}
          />
        </HydrationBoundary>
      </Card>
    </section>
  );
};

export default UpdateSupplierPage;
