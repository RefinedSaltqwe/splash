"use client";
import { cn } from "@/lib/utils";
import React, { useState } from "react";

type ScrollableElementProps = {
  children: React.ReactNode;
  className?: string;
  offsetRight?: string;
  paddingRight?: boolean;
};

const ScrollableElement: React.FC<ScrollableElementProps> = ({
  children,
  className,
  offsetRight,
  paddingRight = true,
}) => {
  const [isFocus, setIsFocus] = useState(false);

  return (
    <div
      className={cn("flex h-full", paddingRight && "pr-1")}
      onMouseOver={() => {
        if (!isFocus) {
          setIsFocus(true);
        }
        return;
      }}
      onMouseLeave={() => {
        if (isFocus) {
          setIsFocus(false);
        }
        return;
      }}
    >
      <div
        className={cn(
          "splash-scroll flex h-full flex-1 flex-col bg-background dark:bg-background",
          isFocus ? "scroll-focus" : "scroll-blur",
          className,
        )}
      >
        <div className={cn(offsetRight)}>{children}</div>
      </div>
    </div>
  );
};
export default ScrollableElement;
