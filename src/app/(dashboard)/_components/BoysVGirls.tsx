"use client";
import ApexChart from "@/components/analytics/ApexChart";
import { barNegativeChartDefault } from "@/constants";
import React from "react";

const BoysVGirls: React.FC = () => {
  const dataBarNegativeChartDefault = barNegativeChartDefault;

  return (
    <ApexChart
      title="Male vs Female"
      subTitle="Mauritius population pyramid 2011"
      data={dataBarNegativeChartDefault}
      type="bar"
      height={400}
    />
  );
};
export default BoysVGirls;
