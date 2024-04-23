"use client";
import { FormDescription, FormLabel } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { type GetAuthUserDetails } from "@/types/prisma";
import { type UserWithPermissionsAndSubAccounts } from "@/types/stripe";
import { type SubAccount, type User } from "@prisma/client";
import React from "react";
import FormSwitch from "../FormSwitch";

type PermissionProps = {
  type: "agency" | "subaccount";
  userData?: Partial<User>;
  authUserDataQuery: GetAuthUserDetails | undefined;
  subAccountPermissions: UserWithPermissionsAndSubAccounts | null | undefined;
  subAccounts?: SubAccount[];
  page: "team" | "settings";
};

const Permission: React.FC<PermissionProps> = ({
  userData,
  type,
  authUserDataQuery,
  subAccountPermissions,
  subAccounts,
  page,
}) => {
  return (
    <div>
      <Separator className="my-4" />
      <FormLabel> User Permissions</FormLabel>
      <FormDescription className="mb-4 font-normal">
        You can give Sub Account access to team member by turning on access
        control for each Sub Account. This is only visible to agency owners
      </FormDescription>
      <div className="flex flex-col gap-4">
        {subAccounts ? (
          subAccounts.length > 0 ? (
            subAccounts.map((subAccount) => {
              return (
                <div key={subAccount.id}>
                  <FormSwitch
                    userData={userData}
                    authUserDataQuery={authUserDataQuery}
                    page={page}
                    role={userData!.role!}
                    type={type}
                    subAccountPermissions={subAccountPermissions}
                    subAccount={subAccount}
                  />
                </div>
              );
            })
          ) : (
            <span className="font-normal text-muted-foreground">
              You don't have any subaccount.
            </span>
          )
        ) : (
          <span className="font-normal text-muted-foreground">
            You don't have any subaccount.
          </span>
        )}
      </div>
    </div>
  );
};
export default Permission;
