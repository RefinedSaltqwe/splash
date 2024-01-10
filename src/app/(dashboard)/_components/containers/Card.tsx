import { cn } from "@/lib/utils";
import React from "react";

type CardProps = {
  children: React.ReactNode;
  padding?: boolean;
};

const Card: React.FC<CardProps> = ({ children, padding = true }) => {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-1 overflow-hidden rounded-2xl border-border bg-card font-bold shadow-lg shadow-muted-foreground/10 dark:shadow-none",
        padding && "px-5 py-6",
      )}
    >
      {children}
    </div>
  );
};
export default Card;
