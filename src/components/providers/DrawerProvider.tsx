import { getUsers } from "@/server/actions/fetch";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import React, { lazy } from "react";
const ServiceDrawer = lazy(() => import("../drawer/ServiceDrawer"));
const GenerateTimesheetDrawer = lazy(
  () => import("../drawer/GenerateTimesheetDrawer"),
);

const DrawerProvider: React.FC = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });
  return (
    <>
      <ServiceDrawer />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <GenerateTimesheetDrawer />
      </HydrationBoundary>
    </>
  );
};
export default DrawerProvider;
