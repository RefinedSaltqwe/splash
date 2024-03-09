"use client";
import { getAuthUserDetails } from "@/server/actions/fetch";
import { useCurrentUserStore } from "@/stores/useCurrentUser";
import { Agency, type User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";

type DashboardWrapperProps = {
  children: React.ReactNode;
  agencyId: string;
  subaccountId?: string;
};

const DashboardWrapper: React.FC<DashboardWrapperProps> = ({
  children,
  agencyId,
  subaccountId,
}) => {
  const { data: user } = useQuery({
    queryKey: ["getAuthUserDetails"],
    queryFn: () => getAuthUserDetails(),
  });
  const setUser = useCurrentUserStore((state) => state.setUser);
  const setUserData = useCurrentUserStore((state) => state.setUserData);
  const setAgencyData = useCurrentUserStore((state) => state.setAgencyData);
  useEffect(() => {
    setUserData(user as User);
    setAgencyData((user?.Agency ?? undefined) as Agency);
    setUser(
      user?.id,
      agencyId,
      user?.name,
      user?.image,
      user?.email,
      user?.role,
      subaccountId ?? "",
    );
  }, [user]);
  return (
    <div className="w-full pl-0 md:pl-72">
      <div className="flex flex-1 justify-center px-2 pb-16 pt-24 md:px-10">
        <div className="flex w-full md:max-w-screen-2xl"> {children}</div>
      </div>
    </div>
  );
};
export default DashboardWrapper;
