import { cn, formatPrice } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";
import React from "react";

type StatsProps = {
  Icon: LucideIcon;
  title: string;
  numberOfInv: number;
  amount: number;
  iconColor: string;
  iconBackground: string;
};

const Stats: React.FC<StatsProps> = ({
  Icon,
  title,
  numberOfInv,
  amount,
  iconColor,
  iconBackground,
}) => {
  return (
    <div className="flex w-full shrink-0 flex-row items-center justify-center">
      <div className="flex h-full items-center justify-center px-5">
        <div className={cn("rounded-full p-[10px] ", iconBackground)}>
          <Icon className={cn(iconColor)} size={30} />
        </div>
      </div>
      <div className="flex flex-col space-y-1 pr-5">
        <span className="font-semibold text-foreground">{title}</span>
        <span className="text-sm font-normal text-muted-foreground">
          {`${numberOfInv} ${numberOfInv > 1 ? "invoices" : "invoice"}`}
        </span>
        <span className="font-semibold text-muted-foreground">
          {formatPrice(amount.toString())}
        </span>
      </div>
    </div>
  );
};
export default Stats;
