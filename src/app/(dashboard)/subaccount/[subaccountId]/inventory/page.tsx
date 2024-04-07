import {
  getInventoryListBySubaccountId,
  getSuppliers,
} from "@/server/actions/fetch";
import { getSubaccountDetails } from "@/server/queries";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import React from "react";
import ClientData from "./_components/ClientData";
import Unauthorized from "@/components/shared/Unauthorized";

type InventoryPageProps = {
  params: {
    subaccountId: string;
  };
};

const InventoryPage: React.FC<InventoryPageProps> = async ({ params }) => {
  const subaccount = await getSubaccountDetails(params.subaccountId);

  if (subaccount === null) {
    <Unauthorized />;
    return;
  }
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryFn: () => getInventoryListBySubaccountId(params.subaccountId),
    queryKey: ["inventory", params.subaccountId],
  });
  await queryClient.prefetchQuery({
    queryFn: () => getSuppliers(subaccount.agencyId),
    queryKey: ["suppliers", subaccount.agencyId],
  });

  return (
    <section className="flex w-full flex-col">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ClientData
          subaccountId={params.subaccountId}
          agencyId={subaccount.agencyId}
        />
      </HydrationBoundary>
    </section>
  );
};
export default InventoryPage;
