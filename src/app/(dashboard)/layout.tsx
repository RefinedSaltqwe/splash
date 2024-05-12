import React from "react";
import LayoutClient from "./_components/LayoutClient";
import { getAgencyIdByLoggedInUser } from "@/server/actions/fetch";

type AdminDashboardLayoutProps = {
  children: React.ReactNode;
};

const AdminDashboardLayout: React.FC<AdminDashboardLayoutProps> = async ({
  children,
}) => {
  const agencyId = await getAgencyIdByLoggedInUser();
  return <LayoutClient agencyId={agencyId ?? ""}>{children}</LayoutClient>;
};
export default AdminDashboardLayout;
