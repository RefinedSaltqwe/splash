"use client";
import { cn } from "@/lib/utils";
import React, { useState } from "react";

type ScrollableElementProps = {
  children: React.ReactNode;
};

const ScrollableElement: React.FC<ScrollableElementProps> = ({ children }) => {
  const [isFocus, setIsFocus] = useState(false);

  return (
    <div
      className="flex h-full pr-1"
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
        )}
      >
        {children}
      </div>
    </div>
  );
};
export default ScrollableElement;
