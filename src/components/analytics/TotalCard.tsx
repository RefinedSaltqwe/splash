import { BarChart, type LucideIcon } from "lucide-react";
import React from "react";

type TotalCardProps = {
  title: string;
  value?: string;
  Icon?: LucideIcon;
  description?: string;
  children?: React.ReactNode;
};

const TotalCard: React.FC<TotalCardProps> = ({
  title,
  value,
  Icon,
  description,
  children,
}) => {
  console.log("TotalCard.tsx: ", value);
  return (
    <div className="flex w-full flex-col space-y-3 text-foreground">
      <div className="flex w-full">
        <span className="text-sm font-semibold capitalize">{title}</span>
      </div>
      {children ? (
        children
      ) : (
        <div className="flex w-full flex-row">
          <div className="flex flex-1 flex-col items-start justify-center space-y-3">
            <div className="flex flex-1">
              <span className="text-3xl">{value}</span>
            </div>
          </div>
          <div className="flex-0 flex w-full items-center justify-end text-primary">
            {Icon ? <Icon size={40} /> : <BarChart size={40} />}
          </div>
        </div>
      )}

      <div className="text-sm font-normal text-muted-foreground">
        {description}
      </div>
    </div>
  );
};
export default TotalCard;
