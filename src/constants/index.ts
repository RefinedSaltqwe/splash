import { type ApexChartType } from "@/types/apexcharts";
import {
  Archive,
  AreaChart,
  CircleDollarSign,
  HardHat,
  HomeIcon,
  Receipt,
  Truck,
  Users,
  type LucideIcon,
  ShieldHalf,
} from "lucide-react";

export const headerLinks = [
  {
    label: "Home",
    route: "/",
  },
];

export type SideMenuLinksChildren = {
  name: string;
  href: string;
};

export type SideMenuLinks = {
  name: string;
  href: string;
  icon: LucideIcon;
  children: SideMenuLinksChildren[];
};

export const sideMenuLinks: SideMenuLinks[] = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: HomeIcon,
    children: [],
  },
  {
    name: "Analytics",
    href: "/admin/analytics/",
    icon: AreaChart,
    children: [],
  },
  {
    name: "Services",
    href: "/admin/expense/services",
    icon: HardHat,
    children: [],
  },
  {
    name: "Expense",
    href: "/admin/expense",
    icon: CircleDollarSign,
    children: [
      { name: "Overview", href: "/admin/expense/overview" },
      { name: "Transactions", href: "/admin/expense/transactions" },
      // Upload Receipts
      { name: "Bills", href: "/admin/expense/bills" },
      { name: "Suppliers", href: "/admin/expense/suppliers" },
    ],
  },
  {
    name: "Employees",
    href: "/admin/employees",
    icon: Users,
    children: [
      { name: "List", href: "/admin/employees/list" },
      { name: "Time Sheet", href: "/admin/employees/time-sheet" },
      { name: "Labor Tracking", href: "/admin/employees/labor-tracking" },
    ],
  },
  {
    name: "Inventory",
    href: "/admin/inventory",
    icon: Archive,
    children: [],
  },
  {
    name: "Customers",
    href: "/admin/customers",
    icon: Users,
    children: [],
  },
  {
    name: "Suppliers",
    href: "/admin/suppliers",
    icon: Truck,
    children: [],
  },
  {
    name: "Invoice",
    href: "/admin/invoice",
    icon: Receipt,
    children: [],
  },
  {
    name: "Teams",
    href: "/admin/teams",
    icon: ShieldHalf,
    children: [],
  },
];

export const authFormDefaultValues = {
  email: "",
};

export const teamsLinks = [
  { id: 1, name: "Heroicons", href: "#", initial: "H", current: false },
  { id: 2, name: "Tailwind Labs", href: "#", initial: "T", current: false },
  { id: 3, name: "Workcation", href: "#", initial: "W", current: false },
];

// ----------------------------Apex Charts Defaults

export const pieChartDefault: ApexChartType = {
  series: [44, 55, 41, 17, 15],
  options: {
    chart: {
      type: "donut",
    },
    dataLabels: {
      background: {
        dropShadow: {
          opacity: 0,
        },
      },
    },
    legend: {},
    tooltip: {
      fillSeriesColor: false,
      cssClass: "pie-chart-tooltip",
    },
    stroke: {
      colors: ["transparent"],
    },
    responsive: [
      {
        breakpoint: 2000,
        options: {
          chart: {
            height: 400,
          },
          legend: {
            position: "bottom",
          },
        },
      },
      {
        breakpoint: 1000,
        options: {
          chart: {
            height: 300,
          },
          legend: {
            position: "right",
          },
        },
      },
    ],
  },
};

export const areaChartDefault: ApexChartType = {
  series: [
    {
      name: "series1",
      data: [31, 40, 28, 51, 42, 109, 100],
    },
    {
      name: "series2",
      data: [11, 32, 45, 32, 34, 52, 41],
    },
  ],
  options: {
    chart: {
      height: "auto",
      type: "area",
    },
    grid: {
      strokeDashArray: 3,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      type: "datetime",
      categories: [
        "2018-09-19T00:00:00.000Z",
        "2018-09-19T01:30:00.000Z",
        "2018-09-19T02:30:00.000Z",
        "2018-09-19T03:30:00.000Z",
        "2018-09-19T04:30:00.000Z",
        "2018-09-19T05:30:00.000Z",
        "2018-09-19T06:30:00.000Z",
      ],
    },
    tooltip: {
      x: {
        format: "MMM",
        // format: "dd/MM/yy HH:mm",
      },
      cssClass: "area-chart-tooltip",
    },
  },
};

export const barChartDefault: ApexChartType = {
  options: {
    chart: {
      id: "basic-bar",
    },
    grid: {
      strokeDashArray: 3,
    },
    xaxis: {
      categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
      labels: {
        style: {
          cssClass: "apex-xaxis-label",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          cssClass: "apex-yaxis-label",
        },
      },
    },
    tooltip: {
      cssClass: "bar-chart-tooltip",
    },
  },
  series: [
    {
      name: "series-1",
      data: [30, 40, 45, 50, 49, 60, 70, 91],
    },
  ],
};

export const barNegativeChartDefault: ApexChartType = {
  series: [
    {
      name: "Males",
      data: [
        4.0, 10.65, 10.76, 10.88, 12.5, 20.1, 20.9, 30.8, 30.9, 40.2, 40, 40.3,
        40.1, 40.2, 40.5, 30.9, 30.5, 30,
      ],
    },
    {
      name: "Females",
      data: [
        -50, -10.05, -16.06, -13.18, -10.4, -20.2, -20.85, -30.7, -30.96,
        -40.22, -40.3, -40.4, -40.1, -40, -40.1, -30.4, -30.1, -2.8,
      ],
    },
  ],
  options: {
    chart: {
      type: "bar",
      height: 440,
      stacked: true,
    },
    colors: ["#008FFB", "#FF4560"],
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "80%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    // stroke: {
    //   width: 1,
    //   colors: ["#fff"],
    // },

    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    yaxis: {
      min: -100,
      max: 100,
      title: {
        // text: 'Age',
      },
    },
    tooltip: {
      shared: false,
      x: {
        formatter: function (val: number) {
          return val.toString();
        },
      },
      y: {
        formatter: function (val: number) {
          return Math.abs(val) + "%";
        },
      },
    },
    // title: {
    //   text: "Mauritius population pyramid 2011",
    // },
    xaxis: {
      categories: [
        "85+",
        "80-84",
        "75-79",
        "70-74",
        "65-69",
        "60-64",
        "55-59",
        "50-54",
        "45-49",
        "40-44",
        "35-39",
        "30-34",
        "25-29",
        "20-24",
        "15-19",
        "10-14",
        "5-9",
        "0-4",
      ],
      title: {
        text: "Percent",
      },
      labels: {
        formatter: function (value: string) {
          const val = Number(value);
          const math = Math.abs(Math.round(val));
          const percent = `${math.toString()}%`;
          return percent;
        },
      },
    },
  },
};

export const barGroupedDefault: ApexChartType = {
  series: [
    {
      data: [44, 55, 41, 64, 22, 43, 21],
    },
    {
      data: [53, 32, 33, 52, 13, 44, 32],
    },
  ],
  options: {
    chart: {
      type: "bar",
      height: 430,
    },
    plotOptions: {
      bar: {
        horizontal: true,
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      offsetX: -6,
      style: {
        fontSize: "12px",
        colors: ["#fff"],
      },
    },
    // stroke: {
    //   show: true,
    //   width: 1,
    //   colors: ["#fff"],
    // },
    tooltip: {
      shared: true,
      intersect: false,
    },
    xaxis: {
      categories: [2001, 2002, 2003, 2004, 2005, 2006, 2007],
    },
  },
};

export const eventDefaultValues = {
  website: "",
  about: "",
  photo: "",
  coverPhoto: "",
  firstname: "",
  lastname: "",
  email: "",
  country: "Canada",
  street: "",
  city: "",
  province: "",
  postalCode: "",
  comments: false,
  candidates: false,
  offers: false,
  pushNotifications: "everything",
};

// Data-Table
type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const payments: Payment[] = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "489e1d42",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
  {
    id: "cfqwcqcq",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
  {
    id: "vw3v2ev2",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },

  // ...
];
