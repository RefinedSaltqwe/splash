"use server";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-actions";
import { authOptions } from "@/server/auth";
import { db } from "@/server/db";
import { getServerSession } from "next-auth";
import { CreateInvoice } from "./schema";
import { type InputType, type ReturnType } from "./types";
import { idGenerator } from "@/lib/utils";

const handler = async (data: InputType): Promise<ReturnType> => {
  const session = await getServerSession(authOptions);

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
    console.log(generateInvoiceId);
    //Insert invoiceId
    const servicesWithInvoiceId = services.map((service) => {
      const newService = {
        price: service.price,
        invoiceId: generateInvoiceId,
        serviceTypeId: service.serviceTypeId,
        description: service.description,
      };
      return newService;
    });

    const invoice = db.invoice.create({
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
      },
    });

    const servicesDB = db.service.createMany({
      data: [...servicesWithInvoiceId],
    });

    const [invoiceData, servicesData] = await Promise.all([
      invoice,
      servicesDB,
    ]);

    if (!invoiceData) {
      throw new ReferenceError("Error creating invoice");
    }
    if (!servicesData) {
      throw new ReferenceError("Error creating services.");
    }
    promiseAll = {
      ...invoiceData,
      services: [],
    };
  } catch (err) {
    return {
      error: `Failed to create: ${!err}`,
    };
  }

  revalidatePath(`/admin/invoice`);
  return { data: promiseAll };
};

export const createInvoice = createSafeAction(CreateInvoice, handler);
