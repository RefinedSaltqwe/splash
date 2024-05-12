"use server";
import { createSafeAction } from "@/lib/create-safe-actions";
import { db } from "@/server/db";
import { currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { UpdateInvoice } from "./schema";
import { type InputType, type ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id, services, payments, ...rest } = data;

  let promiseAll;

  try {
    const session = await currentUser();

    if (!session) {
      throw new Error("Unauthorized: You must be logged in.");
    }

    const [invoicePromise, servicesPromise] = await db.$transaction([
      db.invoice.update({
        where: {
          id,
        },
        data: {
          ...rest,
        },
      }),
      db.service.deleteMany({
        where: {
          invoiceId: id,
        },
      }),
    ]);

    const servicesWithInvoiceId = services.map((service) => {
      const newService = {
        price: service.price,
        invoiceId: id,
        serviceTypeId: service.serviceTypeId,
        description: service.description,
        agencyId: rest.agencyId!,
      };
      return newService;
    });

    const createServices = await db.service.createMany({
      data: [...servicesWithInvoiceId],
    });

    if (payments) {
      const filteredPayments = payments.filter((item) =>
        item.id.includes("new"),
      );
      const paymentsObject = filteredPayments.map((val) => {
        const paymentObject = {
          id: undefined,
          value: val.value,
          invoiceId: id,
          agencyId: rest.agencyId!,
        };
        return paymentObject;
      });

      const createPayments = await db.payment.createMany({
        data: [...paymentsObject],
      });

      if (!createPayments) {
        throw new ReferenceError("Error creating payments.");
      }
    }

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
      Payments: [],
      Agency: null,
    };
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        error: err.message,
      };
    }
  }

  revalidatePath(`/admin/${rest.agencyId}/transactions/invoice`, "page");
  return { data: promiseAll };
};

export const updateInvoice = createSafeAction(UpdateInvoice, handler);
