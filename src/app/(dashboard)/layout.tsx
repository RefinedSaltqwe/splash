import { verifyAndAcceptInvitation } from "@/server/queries";
import React from "react";
import LayoutClient from "./_components/LayoutClient";

type AdminDashboardLayoutProps = {
  children: React.ReactNode;
};

const AdminDashboardLayout: React.FC<AdminDashboardLayoutProps> = async ({
  children,
}) => {
  const agencyId = await verifyAndAcceptInvitation();
  return <LayoutClient agencyId={agencyId ?? ""} children={children} />;
};
export default AdminDashboardLayout;
