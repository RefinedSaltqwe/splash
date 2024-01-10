import { type ApexOptions } from "apexcharts";

export interface ApexChartType {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries | undefined;
  options: ApexOptions;
}
