import Heading from "@/components/shared/Heading";
import { getSuppliers } from "@/server/actions/fetch";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import React from "react";
import ClientButtonLink from "../../_components/ButtonLinks/ClientButtonLink";
import SupplierList from "./_components/SupplierList";

const SupplierPage: React.FC = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryFn: () => getSuppliers(),
    queryKey: ["suppliers"],
  });

  return (
    <section className="flex w-full flex-col">
      <div className="flex items-center justify-between">
        <Heading title="Suppliers" subTitle="Supplier list" />
        <ClientButtonLink
          buttonName="Create Supplier"
          href="/admin/suppliers/create"
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
