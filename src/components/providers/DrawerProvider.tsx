import { getUserById, getUsers } from "@/server/actions/fetch";
import { currentUser } from "@clerk/nextjs";
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
  const user = await currentUser();
  const getUser = await getUserById(user?.id ?? "");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(getUser?.agencyId ?? ""),
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
