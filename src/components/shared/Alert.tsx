import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";
import React from "react";

type AlertProps = {
  color?: string;
  body: string;
  Icon: LucideIcon;
};

const Alert: React.FC<AlertProps> = ({ body, Icon, color = "blue" }) => {
  const borderColor = `border-${color}-400`;
  const iconColor = `text-${color}-400`;
  const bodyColor = `text-${color}-500`;
  return (
    <div className={cn(`w-full border-l-4 p-4`, borderColor)}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={cn(`h-5 w-5`, iconColor)} aria-hidden="true" />
        </div>
        <div className="ml-3">
          <p className={cn(`text-sm`, bodyColor)}>{body}</p>
        </div>
      </div>
    </div>
  );
};
export default Alert;
