import Heading from "@/components/shared/Heading";
import { getServiceTypes } from "@/server/actions/fetch";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import React from "react";
import ServiceList from "./_components/ServiceList";
import CreateButton from "./_components/CreateButton";

type ServicePageProps = {
  params: {
    agencyId: string;
  };
};

const ServicePage: React.FC<ServicePageProps> = async ({ params }) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryFn: () => getServiceTypes(params.agencyId),
    queryKey: ["serviceTypes"],
  });

  return (
    <section className="flex w-full flex-col">
      <div className="flex items-center justify-between">
        <Heading title="Services" subTitle="Services list" />
        <CreateButton />
      </div>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <ServiceList agencyId={params.agencyId} />
      </HydrationBoundary>
    </section>
  );
};
export default ServicePage;
