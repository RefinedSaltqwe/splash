"use client";
import MobileSidebar from "@/components/modal/MobileSidebar";
import DashboardWrapper from "@/components/shared/DashboardWrapper";
import Header from "@/components/shared/Header";
import Sidebar from "@/components/shared/Sidebar";
import { usePathname } from "next/navigation";
import React from "react";

type AdminDashboardLayoutProps = {
  children: React.ReactNode;
};

const AdminDashboardLayout: React.FC<AdminDashboardLayoutProps> = ({
  children,
}) => {
  const pathname = usePathname();

  if (pathname.includes("auth")) {
    //* LAYOUT FOR AUTH
    return (
      <div className="flex h-screen flex-col bg-background">{children}</div>
    );
  } else {
    //* LAYOUT FOR MAIN DASHBOARD
    return (
      <div className=" dash flex h-full flex-col">
        <div className="flex h-full">
          {/* --- Left Panel */}
          <div className="fixed bottom-0 top-0 z-50 hidden w-72 border-r-[1.5px] border-dashed border-slate-200 bg-background md:block dark:border-muted">
            <Sidebar />
            <MobileSidebar />
          </div>
          {/* --- Right Panel */}
          <div className="flex w-full flex-1 flex-col">
            {/* Fixed Header with Fixed Width */}
            <div className="fixed left-auto right-0 top-0 z-50 flex w-full md:w-[calc(100%-288px)]">
              <Header />
            </div>
            <main className="flex h-auto w-full flex-1 bg-background">
              <DashboardWrapper>{children}</DashboardWrapper>
            </main>
          </div>
        </div>
      </div>
    );
  }
};
export default AdminDashboardLayout;
