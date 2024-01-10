import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

type GlassCardProps = {
  gradient: string;
  icon: string;
  title: string;
  subTitle: string;
  color: string;
};

const GlassCard: React.FC<GlassCardProps> = ({
  gradient,
  icon,
  title,
  subTitle,
  color,
}) => {
  return (
    <div
      className={cn(
        "h-full w-full rounded-2xl bg-gradient-to-r px-5 py-6",
        gradient,
      )}
    >
      <div className="flex w-full flex-col items-center justify-center space-y-3">
        <div className="flex flex-1 ">
          <Image src={icon} height={65} width={65} alt="icon" />
        </div>
        <div className="flex flex-col items-center space-x-2">
          <span className={cn("text-3xl ", color)}>{title}</span>
          <span className={cn("text-sm font-semibold ", color)}>
            {subTitle}
          </span>
        </div>
      </div>
    </div>
  );
};
export default GlassCard;
