"use client";
import { type FunnelsWithFunnelPagesAndTotalFunnelVisits } from "@/types/prisma";
import { DonutChart } from "@tremor/react";
import React from "react";

type SubaccountFunnelChartProps = {
  data: FunnelsWithFunnelPagesAndTotalFunnelVisits[];
};
type TooltipType = "none";
type ValueType = number | string | Array<number | string>;
type NameType = number | string;
type Formatter<TValue extends ValueType, TName extends NameType> = (
  value: TValue,
  name: TName,
  item: Payload<TValue, TName>,
  index: number,
  payload: Array<Payload<TValue, TName>>,
) => [React.ReactNode, TName] | React.ReactNode;
interface Payload<TValue extends ValueType, TName extends NameType> {
  type?: TooltipType;
  color?: string;
  formatter?: Formatter<TValue, TName>;
  name?: TName;
  value?: TValue;
  unit?: React.ReactNode;
  dataKey?: string | number;
  payload?: unknown;
  chartType?: string;
  stroke?: string;
  strokeDasharray?: string | number;
  strokeWidth?: number | string;
  className?: string;
  hide?: boolean;
}

const SubaccountFunnelChart = ({ data }: SubaccountFunnelChartProps) => {
  return (
    <div className="flex h-fit items-start transition-all">
      <DonutChart
        className="h-40 w-40"
        data={data}
        category="totalFunnelVisits"
        index="name"
        colors={["blue-400", "primary", "blue-600", "blue-700", "blue-800"]}
        showAnimation={true}
        customTooltip={customTooltip}
        variant="pie"
      />
    </div>
  );
};

export default SubaccountFunnelChart;

const customTooltip = ({
  payload,
  active,
}: {
  payload:
    | Payload<string | number | (string | number)[], string | number>[]
    | undefined;
  active: boolean | undefined;
}) => {
  if (!active || !payload) return null;

  const categoryPayload = payload?.[0];
  if (!categoryPayload) return null;
  return (
    <div className="ml-[100px] w-fit !rounded-lg bg-background/60 p-2 text-black shadow-2xl backdrop-blur-md dark:bg-muted/60 dark:text-white">
      <div className="flex flex-1 items-center space-x-2.5">
        <div
          className={`h-5 w-5 rounded-full  bg-${categoryPayload?.color} rounded`}
        />
        <div className="w-full">
          <div className="flex items-center justify-between space-x-8">
            <p className="whitespace-nowrap text-right">
              {categoryPayload.name}
            </p>
            <p className="whitespace-nowrap text-right font-medium ">
              {categoryPayload.value}
            </p>
          </div>
        </div>
      </div>
      <div>SubAccountFunnelChart</div>
      {/* {categoryPayload.payload.FunnelPages?.map(
        (page: { id: string; name: string; visits: string }) => (
          <div
            key={page.id}
            className="flex items-center justify-between text-black dark:text-white/70"
          >
            <small>{page?.name}</small>
            <small>{page.visits}</small>
          </div>
        ),
      )} */}
    </div>
  );
};
