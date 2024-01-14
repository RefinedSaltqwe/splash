"use server";
import { type Customer } from "@prisma/client";
import { db } from "../../db";

export const getCustomers = async (): Promise<Customer[] | undefined> => {
  try {
    const customers = await db.customer.findMany();
    return [...customers];
  } catch (error) {
    console.log("Error: ", error);
  }
};
