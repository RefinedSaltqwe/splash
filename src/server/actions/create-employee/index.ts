"use server";

import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-actions";

import { db } from "@/server/db";
import { hash } from "bcrypt";
import { CreateEmployee } from "./schema";
import { type InputType, type ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { confirmPassword, password, ...rest } = data;
  const hashedPassword = await hash(password ? password : confirmPassword, 10);
  let promiseAll;
  try {
    const createEmployee = db.user.create({
      data: {
        name: `${rest.firstName} ${rest.lastName}`,
        password: hashedPassword,
        ...rest,
        role: "SUBACCOUNT_USER",
        status: "Pending",
        image: "",
        jobRole: "",
      },
    });

    const updateAuthEmail = db.authorizedEmail.update({
      where: {
        email: rest.email,
      },
      data: {
        registered: true,
      },
    });

    const [employee, authEmail] = await Promise.all([
      createEmployee,
      updateAuthEmail,
    ]);

    const account = await db.account.create({
      data: {
        userId: employee.id,
        type: "credentials",
        provider: "credentials",
        providerAccountId: employee.id,
      },
    });

    if (!employee) {
      throw new Error("Failed to create employee");
    }
    if (!authEmail) {
      throw new Error("Failed to update authorized email");
    }
    if (!account) {
      throw new Error("Failed to update authorized email");
    }
    promiseAll = {
      ...employee,
    };
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        error: err.message,
      };
    }
  }

  revalidatePath(`/admin/customers/create`);
  return { data: promiseAll };
};

export const createEmployee = createSafeAction(CreateEmployee, handler);
