"use server";

import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-actions";

import {
  changeUserPermissions,
  saveActivityLogsNotification,
} from "@/server/queries";
import { currentUser } from "@clerk/nextjs";
import { randomUUID } from "crypto";
import { getUserPermissions } from "../fetch";
import { UpdateUserPermission } from "./schema";
import { type InputType, type ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { subAccountId, val, permissionsId, type, userData, agencyId, page } =
    data;
  try {
    const session = await currentUser();

    if (!session) {
      throw new Error("Unauthorized: You must be logged in.");
    }

    if (!userData?.email) {
      throw new Error("User Data does not exist.");
    }
    const response = await changeUserPermissions(
      permissionsId ? permissionsId : randomUUID(),
      userData.email,
      subAccountId,
      val,
    );
    const subAccountPermissions = await getUserPermissions(userData.id ?? "");
    if (type === "agency") {
      await saveActivityLogsNotification({
        agencyId,
        description: `Gave ${userData?.name} access to | ${subAccountPermissions?.Permissions.find(
          (p: { subAccountId: string }) => p.subAccountId === subAccountId,
        )?.SubAccount.name} `,
        subaccountId: subAccountPermissions?.Permissions.find(
          (p: { subAccountId: string }) => p.subAccountId === subAccountId,
        )?.SubAccount.id,
      });
    }
    if (response) {
      if (subAccountPermissions) {
        subAccountPermissions.Permissions.find((perm) => {
          if (perm.subAccountId === subAccountId) {
            return { ...perm, access: !perm.access };
          }
          return perm;
        });
      }
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        error: err.message,
      };
    }
  }
  if (page === "settings") {
    revalidatePath(`/admin/${agencyId}/settings`);
  } else {
    revalidatePath(`/admin/${agencyId}/team/list/update/${userData.id}`);
  }

  return { data: { message: "success" } };
};

export const updateUserPermission = createSafeAction(
  UpdateUserPermission,
  handler,
);
