"use server";

import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-actions";

import { CreateService } from "./schema";
import { type InputType, type ReturnType } from "./types";
import { db } from "@/server/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";

const handler = async (data: InputType): Promise<ReturnType> => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return {
      error: "Unauthorized",
    };
  }
  // const { name, companyName, email, address, phoneNumber } = data;
  let newCustomer;
  // try {
  //   newCustomer = await db.customer.create({
  //     data: {
  //       name,
  //       companyName: companyName ? companyName : "N/A",
  //       address,
  //       email,
  //       phoneNumber,
  //     },
  //   });
  // } catch (error) {
  //   return {
  //     error: "Failed to create.",
  //   };
  // }

  revalidatePath(`/admin/customers/create`);
  return { data: newCustomer };
};

export const createService = createSafeAction(CreateService, handler);
