import { env } from "@/env";
import { type Invoice, type User } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";

import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Reorder Drag and Drop by index
export function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed!);

  return result;
}

export function getStripeOAuthLink(
  accountType: "admin" | "subaccount",
  state: string,
) {
  return `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${env.NEXT_PUBLIC_STRIPE_CLIENT_ID}&scope=read_write&redirect_uri=${env.NEXT_PUBLIC_URL}${accountType}&state=${state}`;
}

export const formatDateTime = (dateString: Date | string) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    month: "short", // abbreviated month name (e.g., 'Oct')
    day: "numeric", // numeric day of the month (e.g., '25')
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    month: "short", // abbreviated month name (e.g., 'Oct')
    year: "numeric", // numeric year (e.g., '2023')
    day: "numeric", // numeric day of the month (e.g., '25')
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const formattedDateTime: string = new Date(dateString).toLocaleString(
    "en-CA",
    dateTimeOptions,
  );

  const formattedDate: string = new Date(dateString).toLocaleString(
    "en-CA",
    dateOptions,
  );

  const formattedTime: string = new Date(dateString).toLocaleString(
    "en-CA",
    timeOptions,
  );

  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

export const formatPrice = (price: string) => {
  const amount = parseFloat(price);
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

  return formattedPrice;
};
export const floatToTwoDecimal = (number: number) => {
  const formattedNumber = (Math.round(number * 100) / 100).toFixed(2);
  return formattedNumber;
};

export const calculateCurrentAndFutureDates = (future: Date) => {
  // Future Date
  const firstDate: Date = future;

  // Current Date
  const secondDate: Date = new Date();

  // Time Difference in Milliseconds
  const milliDiff: number = firstDate.getTime() - secondDate.getTime();

  // Converting time into hh:mm:ss format

  // Total number of seconds in the difference
  const totalSeconds = Math.floor(milliDiff / 1000);

  // Total number of minutes in the difference
  const totalMinutes = Math.floor(totalSeconds / 60);

  // Total number of hours in the difference
  const totalHours = Math.floor(totalMinutes / 60);

  // Getting the number of seconds left in one minute
  const remSeconds = totalSeconds % 60;

  // Getting the number of minutes left in one hour
  const remMinutes = totalMinutes % 60;

  return {
    days: totalHours / 24,
  };
};

export const convertInvoiceStatus = (num: string) => {
  let x = "";
  switch (num) {
    case "1":
      x = "Paid";
      break;
    case "2":
      x = "Partially Paid";
      break;
    case "3":
      x = "Unpaid";
      break;
    default:
      x = "Overdue";
      break;
  }
  return x;
};

export function convertStatusToColor(status: string) {
  if (status === "1") {
    return "green";
  } else if (status === "2") {
    return "yellow";
  } else if (status === "3") {
    return "orange";
  } else if (status === "4") {
    return "red";
  }
}

function getlength(number: number) {
  return number.toString().length;
}

export function idGenerator(invoiceCount: number) {
  let id = "INV-";
  const digitLength = getlength(invoiceCount);
  const initialId = invoiceCount + 1;
  switch (digitLength) {
    case 1:
      id += "000" + initialId;
      break;
    case 2:
      id += "00" + initialId;
      break;
    case 3:
      id += "0" + initialId;
      break;
    default:
      id += initialId;
      break;
  }
  return id;
}

export function statusGenerator(payment: number, total: number, dueDate: Date) {
  if (dueDate < new Date() && payment < total) {
    return "4";
  } else if (total == 0) {
    return "1";
  } else if (payment === 0) {
    return "3";
  } else if (payment < total) {
    return "2";
  } else if (payment >= total) {
    return "1";
  }
}

export const subTotalPlusShippingMinusDiscount = (
  subTotal: number,
  shipping: number,
  discount: number,
) => {
  const withShipping = subTotal + shipping;
  const minusDiscount = withShipping - discount;

  return Math.round((minusDiscount + Number.EPSILON) * 100) / 100;
};

export const taxValue = (minusDiscount: number, tax: number) => {
  return Math.round((minusDiscount * (tax / 100) + Number.EPSILON) * 100) / 100;
};

export const totalValueWithTax = (
  subTotal: number,
  shipping: number,
  discount: number,
  tax: number,
) => {
  const subTotalVal = subTotalPlusShippingMinusDiscount(
    subTotal,
    shipping,
    discount,
  );
  const taxVal = taxValue(subTotalVal, tax);
  return Math.round((subTotalVal + taxVal + Number.EPSILON) * 100) / 100;
};

function generateRandomId(): string {
  // You can implement your own logic to generate unique IDs
  return Math.random().toString(36).substring(2, 10);
}

function generateRandomNumber(num: number): number {
  // You can implement your own logic to generate random phone numbers
  return Math.floor(Math.random() * num);
}

function generateDate(): Date {
  const currentDate = new Date();
  return currentDate;
}

const generateRandomUserForInvoice = (): Invoice => ({
  id: `INV-${generateRandomNumber(100000)}`,
  customerId: generateRandomId(),
  createdAt: generateDate(),
  dueDate: generateDate(),
  payment: generateRandomNumber(100),
  total: 100,
  status:
    generateRandomNumber(4) === 1
      ? "1"
      : generateRandomNumber(4) === 2
        ? "2"
        : generateRandomNumber(4) === 3
          ? "3"
          : "4",
  tax: 0,
  shipping: 0,
  subTotal: 0,
  discount: 0,
  agencyId: "",
});

const generateRandomUsers = (count: number): User[] => {
  const users: User[] = [];
  for (let i = 0; i < count; i++) {
    // users.push(generateRandomUser());
  }
  return users;
};

export const generateRandomInvoice = (count: number): Invoice[] => {
  const users: Invoice[] = [];
  for (let i = 0; i < count; i++) {
    users.push(generateRandomUserForInvoice());
  }
  return users;
};

export async function getData(): Promise<User[]> {
  //? Fetch data from your API here.
  const generatedUsers: User[] = generateRandomUsers(1);
  const users = generatedUsers;
  return users;
}

export const getFirstAndLastDatesNextWeek = (dayOfWeek: number) => {
  const dateTimeLocalNow = new Date(
    new Date().getTime() - new Date().getTimezoneOffset() * 60_000,
  )
    .toISOString()
    .slice(0, 16);

  const curr = new Date(dateTimeLocalNow);
  // today's date eg. 2024-02-13(Tue) => 13 + 7 = 2024-02-20(Tue) => 20-2(Tue is 2nd Day of the week) = 2024-02-18(Sun) start day of the week

  //13 + 7 = 2024-02-20(Tue)
  const firstDayOfNextWeek = curr.getDate() + 7 - curr.getDay();
  const specificDate = firstDayOfNextWeek + (dayOfWeek - 1);
  const date: Date = new Date(curr.setDate(specificDate));

  return date;
};

export const getDayWithSpecificDate = (dayOfWeek: number, startDate: Date) => {
  const date = new Date(startDate);
  const resultDate = new Date(startDate);

  resultDate.setDate(
    date.getDate() + ((7 + (dayOfWeek - 1) - date.getDay()) % 7),
  );
  return resultDate;
};
