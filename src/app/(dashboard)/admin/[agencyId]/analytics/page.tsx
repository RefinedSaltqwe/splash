import BoysVGirls from "@/app/(dashboard)/_components/BoysVGirls";
import ApexChart from "@/components/analytics/ApexChart";
import GlassCard from "@/components/analytics/GlassCard";
import TotalCard from "@/components/analytics/TotalCard";
import GridColumn from "@/components/shared/GridColumn";
import GridWrapper from "@/components/shared/GridWrapper";
import Heading from "@/components/shared/Heading";
import {
  areaChartDefault,
  barChartDefault,
  barGroupedDefault,
  pieChartDefault,
} from "@/constants";
import { currentUser } from "@clerk/nextjs";
import React from "react";

type AnalyticsPageProps = object;

const AnalyticsPage: React.FC<AnalyticsPageProps> = async () => {
  const session = await currentUser();
  const dataPieChart = pieChartDefault;
  const dataAreaChart = areaChartDefault;
  const dataBarAreaChart = barChartDefault;
  const dataGroupedBar = barGroupedDefault;

  return (
    <section className="w-full">
      <Heading
        title={`Hi ${session?.firstName}, welcome back!`}
        subTitle="Dashboard"
      />
      <GridWrapper>
        <GridColumn colSpan="lg:col-span-4" padding={false}>
          <GlassCard
            gradient="from-emerald-50 to-green-100"
            icon="/assets/icons/glass-money.png"
            title="715k"
            subTitle="Weekly Sales"
            color="text-green-900/80"
          />
        </GridColumn>
        <GridColumn colSpan="lg:col-span-4" padding={false}>
          <GlassCard
            gradient="from-amber-50 to-orange-100"
            icon="/assets/icons/glass-users.png"
            title="1.92m"
            subTitle="Website Visitors"
            color="text-orange-900/80"
          />
        </GridColumn>
        <GridColumn colSpan="lg:col-span-4" padding={false}>
          <GlassCard
            gradient="from-sky-50 to-blue-100"
            icon="/assets/icons/glass-quotes.png"
            title="3,124"
            subTitle="Quotes"
            color="text-blue-900/80"
          />
        </GridColumn>
      </GridWrapper>
      <GridWrapper>
        <GridColumn colSpan="lg:col-span-4">
          <TotalCard title="Total Active Users" />
        </GridColumn>
        <GridColumn colSpan="lg:col-span-4">
          <TotalCard title="Example 1" />
        </GridColumn>
        <GridColumn colSpan="lg:col-span-4">
          <TotalCard title="Example 2" />
        </GridColumn>
      </GridWrapper>
      <GridWrapper>
        <GridColumn colSpan="lg:col-span-6">
          <ApexChart
            title="Area Chart"
            data={dataAreaChart}
            type="area"
            height={350}
            id="area-chart"
          />
        </GridColumn>
        <GridColumn colSpan="lg:col-span-6">
          <ApexChart
            title="Series Chart"
            data={dataPieChart}
            type="donut"
            height={400}
          />
        </GridColumn>
      </GridWrapper>
      <GridWrapper>
        <GridColumn colSpan="lg:col-span-4">
          <BoysVGirls />
        </GridColumn>
        <GridColumn colSpan="lg:col-span-4" syncHeight={true}>
          <ApexChart
            title="Bar"
            subTitle="(+43%) than last year"
            data={dataBarAreaChart}
            type="bar"
            height={400}
            id="bar-chart"
          />
        </GridColumn>
        <GridColumn colSpan="lg:col-span-4" syncHeight={true}>
          <ApexChart
            title="Grouped Bar"
            subTitle="(+43%) than last year"
            data={dataGroupedBar}
            type="bar"
            height={400}
          />
        </GridColumn>
      </GridWrapper>
    </section>
  );
};
export default AnalyticsPage;
