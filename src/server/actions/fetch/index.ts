"use server";
import { type Invoice, type Customer } from "@prisma/client";
import { db } from "../../db";
import { cache } from "react";
import { type InvoiceWithService } from "@/types/prisma";

export const getCustomers = cache(async (): Promise<Customer[] | undefined> => {
  try {
    const customers = await db.customer.findMany();
    return [...customers];
  } catch (error) {
    console.log("Error: ", error);
  }
});

export const getCustomer = cache(
  async (id: string): Promise<Customer | undefined> => {
    try {
      const customers = await db.customer.findUnique({
        where: {
          id,
        },
      });
      return customers!;
    } catch (error) {
      console.log("Error: ", error);
    }
  },
);

export const getInvoices = cache(async (): Promise<Invoice[] | undefined> => {
  try {
    const invoices = await db.invoice.findMany({
      orderBy: { createdAt: "asc" },
    });
    return [...invoices];
  } catch (error) {
    console.log("Error: ", error);
  }
});

export const getInvoiceWithServices = cache(
  async (id: string): Promise<InvoiceWithService | undefined | null> => {
    try {
      const invoiceWithServices = db.invoice.findUnique({
        where: {
          id,
        },
        include: {
          services: true,
        },
      });
      return invoiceWithServices;
    } catch (error) {
      console.log("Error: ", error);
    }
  },
);
