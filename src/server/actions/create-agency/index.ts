"use server";

import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-actions";

import { initUser, upsertAgency } from "@/server/queries";
import { randomUUID } from "crypto";
import { CreateAdmin } from "./schema";
import { type InputType, type ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  let promiseAll;
  try {
    let custId;
    if (!data?.id) {
      const bodyData = {
        email: data.companyEmail,
        name: data.name,
        shipping: {
          address: {
            city: data.city,
            country: data.country,
            line1: data.address,
            postal_code: data.zipCode,
            state: data.zipCode,
          },
          name: data.name,
        },
        address: {
          city: data.city,
          country: data.country,
          line1: data.address,
          postal_code: data.zipCode,
          state: data.zipCode,
        },
      };

      // const customerResponse = await fetch("/api/stripe/create-customer", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(bodyData),
      // });

      // // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      // const customerData: { customerId: string } =
      //   await customerResponse.json();
      // custId = customerData.customerId;
    }
    await initUser({
      role: "AGENCY_OWNER",
      phoneNumber: data.companyPhone,
      street: data.address,
      city: data.city,
      state: data.state,
      postalCode: data.zipCode,
    });
    // if (!data?.customerId && !custId) return { data: undefined };

    await upsertAgency({
      id: data?.id ?? randomUUID(),
      customerId: data?.customerId ?? custId ?? "",
      address: data.address,
      agencyLogo: data.agencyLogo,
      city: data.city,
      companyPhone: data.companyPhone,
      country: "Canada",
      name: data.name,
      state: data.state,
      whiteLabel: data.whiteLabel,
      zipCode: data.zipCode,
      createdAt: new Date(),
      updatedAt: new Date(),
      companyEmail: data.companyEmail,
      connectAccountId: "",
      goal: 5,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        error: err.message,
      };
    }
  }
  revalidatePath(`/admin`);
  return { data: promiseAll };
};

export const createAdmin = createSafeAction(CreateAdmin, handler);
