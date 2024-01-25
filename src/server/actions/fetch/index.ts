"use server";
import { type InvoiceWithService } from "@/types/prisma";
import { type ServiceType, type Customer, type Invoice } from "@prisma/client";
import { cache } from "react";
import { db } from "../../db";

export const getCustomers = cache(async (): Promise<Customer[] | undefined> => {
  try {
    const customers = await db.customer.findMany({
      orderBy: { createdAt: "asc" },
    });
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

export const getServiceType = cache(
  async (id: string): Promise<ServiceType | undefined> => {
    try {
      const service = await db.serviceType.findUnique({
        where: {
          id,
        },
      });
      return service!;
    } catch (error) {
      console.log("Error: ", error);
    }
  },
);

export const getServiceTypes = cache(
  async (): Promise<ServiceType[] | undefined> => {
    try {
      const services = await db.serviceType.findMany({
        orderBy: { name: "asc" },
      });
      return [...services];
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
