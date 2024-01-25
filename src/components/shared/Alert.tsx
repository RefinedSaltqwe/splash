import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";
import React from "react";

type AlertProps = {
  color: string;
  body: string;
  Icon: LucideIcon;
};

const Alert: React.FC<AlertProps> = ({ body, Icon, color }) => {
  return (
    <div className={`border-l-4 border-${color}-400 w-full p-4`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 text-${color}-400`} aria-hidden="true" />
        </div>
        <div className="ml-3">
          <p className={cn(`text-sm text-${color}-500`)}>{body}</p>
        </div>
      </div>
    </div>
  );
};
export default Alert;
