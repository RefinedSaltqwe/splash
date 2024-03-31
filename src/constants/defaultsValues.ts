import { type TimesheetRowKey, type TimesheetField } from "@/types";
import {
  AlertTriangle,
  AlignLeft,
  Antenna,
  Archive,
  AreaChart,
  BarChart,
  Bell,
  Calendar,
  CheckCircle,
  CircleDollarSign,
  ClipboardIcon,
  Compass,
  Contact,
  Cpu,
  CreditCard,
  Database,
  Flag,
  GitBranch,
  HardHat,
  Headphones,
  Home,
  HomeIcon,
  Info,
  LinkIcon,
  Lock,
  MessageSquareText,
  Power,
  Receipt,
  Send,
  Settings,
  Shield,
  Star,
  Truck,
  UserRound,
  Users,
  Video,
  Wallet,
} from "lucide-react";

export const customerDefaultValues = {
  name: "",
  companyName: "",
  address: "",
  email: "",
  phoneNumber: "",
  agencyId: "",
};

export const rowKeys: TimesheetRowKey[] = [
  "timeIn",
  "breakOut",
  "breakIn",
  "timeOut",
];
export const fields: TimesheetField[] = [
  "sun",
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
];

export const rowName = {
  timeIn: "Time-in",
  breakOut: "Break-out",
  breakIn: "Break-in",
  timeOut: "Time-out",
};

export const pricingCards = [
  {
    title: "Starter",
    description: "Perfect for trying out splash",
    price: "Free",
    duration: "",
    highlight: "Key features",
    features: ["3 Sub accounts", "2 Team members", "Unlimited pipelines"],
    priceId: "price_1Oy4C7HWcDxTr9jhGjBTZTnl",
  },
  {
    title: "Unlimited",
    description: "The ultimate agency kit",
    price: "$199",
    duration: "month",
    highlight: "Key features",
    features: ["Rebilling", "24/7 Support team"],
    priceId: "price_1OsvDQHWcDxTr9jhM8YxUGnA",
  },
  {
    title: "Basic",
    description: "For serious agency owners",
    price: "$99",
    duration: "month",
    highlight: "Everything in Starter, plus",
    features: ["Unlimited Sub accounts", "Unlimited Team members"],
    priceId: "price_1OsvDQHWcDxTr9jhU2PS17jJ",
  },
];

export const addOnProducts = [
  { title: "Priority Support", id: "prod_PilAX4P9MqTqw4" },
];

export const icons = {
  dashboard: HomeIcon,
  analytics: AreaChart,
  services: HardHat,
  expense: CircleDollarSign,
  employees: Users,
  inventory: Archive,
  customers: Users,
  suppliers: Truck,
  invoice: Receipt,
  chart: BarChart,
  headphone: Headphones,
  send: Send,
  pipelines: GitBranch,
  calendar: Calendar,
  settings: Settings,
  check: CheckCircle,
  chip: Cpu,
  compass: Compass,
  database: Database,
  flag: Flag,
  home: Home,
  info: Info,
  link: LinkIcon,
  lock: Lock,
  messages: MessageSquareText,
  notification: Bell,
  payment: CreditCard,
  power: Power,
  receipt: Receipt,
  shield: Shield,
  star: Star,
  tune: Antenna,
  videorecorder: Video,
  wallet: Wallet,
  warning: AlertTriangle,
  person: UserRound,
  category: AlignLeft,
  contact: Contact,
  clipboardIcon: ClipboardIcon,
};

export type EditorBtns =
  | "text"
  | "container"
  | "section"
  | "contactForm"
  | "paymentForm"
  | "link"
  | "2Col"
  | "video"
  | "__body"
  | "image"
  | null
  | "3Col";

export const defaultStyles: React.CSSProperties = {
  backgroundPosition: "center",
  objectFit: "cover",
  backgroundRepeat: "no-repeat",
  textAlign: "left",
  opacity: "100%",
};
