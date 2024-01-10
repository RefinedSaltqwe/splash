"use client";
import { type ApexChartType } from "@/types/apexcharts";
import React from "react";
import ReactApexChart from "react-apexcharts";
import CardHeading from "../shared/CardHeading";

type ApexChartProps = {
  title?: string;
  subTitle?: string;
  data: ApexChartType;
  id?: string;
  type:
    | "area"
    | "line"
    | "donut"
    | "bar"
    | "pie"
    | "radialBar"
    | "scatter"
    | "bubble"
    | "heatmap"
    | "candlestick"
    | "boxPlot"
    | "radar"
    | "polarArea"
    | "rangeBar"
    | "rangeArea"
    | "treemap";
  height?: string | number;
};

const ApexChart: React.FC<ApexChartProps> = ({
  title,
  subTitle,
  data,
  type,
  id,
  height = "100%",
}) => {
  return (
    <div className="flex w-full flex-col" id="bar-chart">
      {title && <CardHeading title={title} subTitle={subTitle} />}
      <div id={id} className="h-full w-full">
        <ReactApexChart
          options={data.options}
          series={data.series}
          type={type}
          height={height}
        />
      </div>
    </div>
  );
};
export default ApexChart;
