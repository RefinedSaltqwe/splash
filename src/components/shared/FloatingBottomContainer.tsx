import { cn } from "@/lib/utils";
import React from "react";

type FloatingBottomContainerProps = {
  children: React.ReactNode;
  padding?: boolean;
};

const FloatingBottomContainer: React.FC<FloatingBottomContainerProps> = ({
  children,
  padding = true,
}) => {
  return (
    <div className="fixed bottom-0 left-auto right-0 z-50 flex w-full md:w-[calc(100%-288px)]">
      <div className={cn(padding && "px-7 pb-3", "w-full")}>{children}</div>
    </div>
  );
};
export default FloatingBottomContainer;
