import Heading from "@/components/shared/Heading";
import { getSuppliers } from "@/server/actions/fetch";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import React from "react";
import SupplierList from "./_components/SupplierList";
import ClientButtonLink from "@/app/(dashboard)/_components/ButtonLinks/ClientButtonLink";

type SupplierPageProps = {
  params: {
    agencyId: string;
  };
};

const SupplierPage: React.FC<SupplierPageProps> = async ({ params }) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryFn: () => getSuppliers(params.agencyId),
    queryKey: ["suppliers"],
  });

  return (
    <section className="flex w-full flex-col">
      <div className="flex items-center justify-between">
        <Heading title="Suppliers" subTitle="Supplier list" />
        <ClientButtonLink
          buttonName="Create Supplier"
          href={`/admin/${params.agencyId}/suppliers/create`}
          variant={"secondary"}
        />
      </div>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <SupplierList />
      </HydrationBoundary>
    </section>
  );
};
export default SupplierPage;
