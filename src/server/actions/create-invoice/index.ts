"use server";
import { createSafeAction } from "@/lib/create-safe-actions";
import { idGenerator } from "@/lib/utils";
import { db } from "@/server/db";
import { currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { CreateInvoice } from "./schema";
import { type InputType, type ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const session = await currentUser();

  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  const {
    customerId,
    status,
    dueDate,
    shipping,
    tax,
    payment,
    discount,
    subTotal,
    total,
    agencyId,
    services,
  } = data;

  let promiseAll;

  try {
    const getLastInvoiceId = await db.invoice.findFirst({
      orderBy: { createdAt: "desc" },
      select: { id: true },
    });

    const extractIdNumber = getLastInvoiceId
      ? getLastInvoiceId.id.split("-")[1]
      : "0";
    //Get the last invoice id
    const convertIntoNumber = parseInt(extractIdNumber ? extractIdNumber : "0");
    const generateInvoiceId = idGenerator(convertIntoNumber);
    //Insert invoiceId into service.invoiceId
    const servicesWithInvoiceId = services.map((service) => {
      const newService = {
        agencyId: agencyId!,
        price: service.price,
        invoiceId: generateInvoiceId,
        serviceTypeId: service.serviceTypeId,
        description: service.description,
      };
      return newService;
    });

    const invoice = await db.invoice.create({
      data: {
        id: generateInvoiceId,
        customerId,
        status,
        dueDate,
        shipping,
        tax: tax ? tax : 0,
        payment,
        discount,
        subTotal,
        total,
        agencyId: agencyId!,
      },
    });

    const servicesDB = await db.service.createMany({
      data: [...servicesWithInvoiceId],
    });

    if (!invoice) {
      throw new ReferenceError("Error creating invoice");
    }
    if (!servicesDB) {
      throw new ReferenceError("Error creating services.");
    }
    promiseAll = {
      ...invoice,
      services: [],
    };
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        error: err.message,
      };
    }
  }

  revalidatePath(`/admin/invoice`);
  return { data: promiseAll };
};

export const createInvoice = createSafeAction(CreateInvoice, handler);
