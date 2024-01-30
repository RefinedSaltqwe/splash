"use server";
import { createSafeAction } from "@/lib/create-safe-actions";
import { authOptions } from "@/server/auth";
import { db } from "@/server/db";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { UpdateInvoice } from "./schema";
import { type InputType, type ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  const { id, services, ...rest } = data;

  let promiseAll;

  try {
    const updateInvoice = db.invoice.update({
      where: {
        id,
      },
      data: {
        ...rest,
      },
    });
    const deleteServices = db.service.deleteMany({
      where: {
        invoiceId: id,
      },
    });

    const [invoicePromise, servicesPromise] = await Promise.all([
      updateInvoice,
      deleteServices,
    ]);

    const servicesWithInvoiceId = services.map((service) => {
      const newService = {
        price: service.price,
        invoiceId: id,
        serviceTypeId: service.serviceTypeId,
        description: service.description,
      };
      return newService;
    });

    const createServices = await db.service.createMany({
      data: [...servicesWithInvoiceId],
    });

    if (!invoicePromise) {
      throw new ReferenceError("Error updating invoice");
    }
    if (!servicesPromise) {
      throw new ReferenceError("Error deleting services.");
    }
    if (!createServices) {
      throw new ReferenceError("Error creating services.");
    }

    promiseAll = {
      ...invoicePromise,
      services: [],
    };
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        error: err.message,
      };
    }
  }

  revalidatePath(`/admin/invoice/update/${id}`);
  return { data: promiseAll };
};

export const updateInvoice = createSafeAction(UpdateInvoice, handler);
