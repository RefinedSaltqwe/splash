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

const ServicePage: React.FC = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryFn: () => getServiceTypes(),
    queryKey: ["serviceTypes"],
  });

  return (
    <section className="flex w-full flex-col">
      <div className="flex items-center justify-between">
        <Heading title="Services" subTitle="Services list" />
        <CreateButton />
      </div>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <ServiceList />
      </HydrationBoundary>
    </section>
  );
};
export default ServicePage;
