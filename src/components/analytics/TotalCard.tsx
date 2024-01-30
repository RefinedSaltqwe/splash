import { ArrowUp, BarChart } from "lucide-react";
import React from "react";

type TotalCardProps = {
  title: string;
  data?: string;
};

const TotalCard: React.FC<TotalCardProps> = ({ title, data }) => {
  console.log("TotalCard.tsx: ", data);
  return (
    <div className="flex w-full flex-col space-y-3 text-foreground">
      <div className="flex w-full">
        <span className="text-sm font-semibold capitalize">{title}</span>
      </div>
      <div className="flex w-full flex-row">
        <div className="flex flex-1 flex-col items-start justify-center space-y-3">
          <div className="flex space-x-2 text-sm font-semibold">
            <ArrowUp size={20} className="text-green-500" />
            <span>+2.6%</span>
          </div>
        </div>
        <div className="flex-0 flex w-full items-center justify-end text-green-500">
          <BarChart size={40} />
        </div>
      </div>

      <div className="flex flex-1">
        <span className="text-3xl">14,876</span>
      </div>
    </div>
  );
};
export default TotalCard;
