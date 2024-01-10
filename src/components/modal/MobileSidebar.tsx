"use client";
import { useMobileSidebar } from "@/stores/useMobileSidebar";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Sheet, SheetContent } from "../ui/sheet";
import Sidebar from "../shared/Sidebar";

type MobileSidebarProps = object;

const MobileSidebar: React.FC<MobileSidebarProps> = () => {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const onClose = useMobileSidebar((state) => state.onClose);
  const isOpen = useMobileSidebar((state) => state.isOpen);

  // Whenever the pathname changes the mobile navbar will close
  // When user clicks on the navigation link
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  // Hydration error purposes
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex md:hidden">
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent
          side={"left"}
          className="w-[288px] border-transparent p-0"
        >
          <Sidebar />
        </SheetContent>
      </Sheet>
    </div>
  );
};
export default MobileSidebar;
