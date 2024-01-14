import { cn } from "@/lib/utils";
import React from "react";

type LoaderProps = {
  classNames?: string;
  type?: "spinner" | "pulse";
};

const Loader: React.FC<LoaderProps> = ({ classNames, type = "spinner" }) => {
  if (type == "spinner") {
    return (
      <div
        className={cn(
          "inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]",
          classNames,
        )}
        role="status"
      ></div>
    );
  } else {
    return (
      <div
        className="inline-block h-4 w-4 animate-[spinner-grow_0.75s_linear_infinite] rounded-full bg-current align-[-0.125em] opacity-0 motion-reduce:animate-[spinner-grow_1.5s_linear_infinite]"
        role="status"
      >
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          Loading...
        </span>
      </div>
    );
  }
};
export default Loader;
