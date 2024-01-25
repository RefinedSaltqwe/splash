import { cn, formatPrice } from "@/lib/utils";
import React from "react";

type FinalDetailsProps = {
  parentClassNames?: string;
  childClassNames?: string;
  title: string;
  value?: number;
  isMinus?: boolean;
};

const FinalDetails: React.FC<FinalDetailsProps> = ({
  parentClassNames,
  childClassNames,
  title,
  isMinus = false,
  value = 0.0,
}) => {
  return (
    <div className="col-span-full grid grid-cols-2">
      <span
        className={cn(
          "text-end font-normal text-muted-foreground",
          parentClassNames,
        )}
      >
        {title}
      </span>
      <span
        className={cn(
          "text-end font-normal text-muted-foreground",
          childClassNames,
        )}
      >
        {isMinus && value != undefined && value != 0 ? "-" : ""}
        {value && value != undefined ? `${formatPrice(String(value))}` : "-"}
      </span>
    </div>
  );
};
export default FinalDetails;
