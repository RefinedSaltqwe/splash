import { cn } from "@/lib/utils";
import React from "react";

type CardProps = {
  children: React.ReactNode;
  padding?: boolean;
  glass?: boolean;
  rounded?: boolean;
  overflowHidden?: boolean;
};

const Card: React.FC<CardProps> = ({
  children,
  padding = true,
  glass = false,
  rounded = true,
  overflowHidden = true,
}) => {
  return (
    <div
      className={cn(
        "flex h-auto w-full flex-1 border-border bg-card font-bold shadow-lg shadow-muted-foreground/10 dark:shadow-none",
        padding && "px-5 py-6",
        glass && "bg-card/80 px-5 py-3 backdrop-blur",
        rounded && "rounded-2xl",
        overflowHidden && "overflow-hidden",
      )}
    >
      {children}
    </div>
  );
};
export default Card;
