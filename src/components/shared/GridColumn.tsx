import Card from "@/app/(dashboard)/_components/containers/Card";
import { cn } from "@/lib/utils";
import React from "react";

type GridColumnProps = {
  children: React.ReactNode;
  colSpan?: string;
  syncHeight?: boolean;
  padding?: boolean;
};

const GridColumn: React.FC<GridColumnProps> = ({
  children,
  colSpan,
  syncHeight = false,
  padding,
}) => {
  return (
    <div className={cn("col-span-12 h-auto w-full", colSpan)}>
      <div
        className={cn("w-full text-muted-foreground", syncHeight && "h-full")}
      >
        <Card padding={padding}>{children}</Card>
      </div>
    </div>
  );
};
export default GridColumn;
