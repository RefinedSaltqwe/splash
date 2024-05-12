"use client";
import {
  getAuthUserDetails,
  getSubaccountDetails,
} from "@/server/actions/fetch";
import { useCurrentUserStore } from "@/stores/useCurrentUser";
import { type Agency, type User } from "@prisma/client";
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

  const { data: subaccount } = useQuery({
    queryKey: ["subaccount", subaccountId],
    queryFn: () => getSubaccountDetails(subaccountId ?? ""),
    enabled: !!subaccountId,
  });

  const setUser = useCurrentUserStore((state) => state.setUser);
  const setUserData = useCurrentUserStore((state) => state.setUserData);
  const setAgencyData = useCurrentUserStore((state) => state.setAgencyData);
  const setSubaccountData = useCurrentUserStore(
    (state) => state.setSubaccountData,
  );
  useEffect(() => {
    setUserData(user as User);
    setAgencyData((user?.Agency ?? undefined) as Agency);
    setSubaccountData(subaccount);
    setUser(
      user?.id,
      agencyId,
      user?.name,
      user?.image,
      user?.email,
      user?.role,
      subaccountId ?? "",
    );
    if (!subaccountId) {
      setSubaccountData(null);
    }
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
