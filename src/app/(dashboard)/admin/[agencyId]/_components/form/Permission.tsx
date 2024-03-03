"use client";
import { FormDescription, FormLabel } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useAction } from "@/hooks/useAction";
import { updateUserPermission } from "@/server/actions/update-permissions";
import { type GetAuthUserDetails } from "@/types/prisma";
import { type UserWithPermissionsAndSubAccounts } from "@/types/stripe";
import { type SubAccount, type User } from "@prisma/client";
import React, { useCallback, useState } from "react";
import { toast } from "sonner";
import FormSwitch from "../FormSwitch";
import { useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();
  const [permisionSwitch, setPermissionSwitch] = useState(false);
  const { execute: onChangePermission, isLoading } = useAction(
    updateUserPermission,
    {
      onSuccess: (data) => {
        toast.success(`Change user permission ${data.message}.`);
        void queryClient.invalidateQueries({
          queryKey: ["agencyWithSubAccount", userData?.id],
        });
      },
      onError: (error) => {
        toast.error(error);
      },
    },
  );

  const onSwitchChange = useCallback(
    (subAccId: string, permission: boolean, permissionsId: string) => {
      setPermissionSwitch(!permission);

      const userDataPartial = {
        id: userData?.id ?? "",
        name: userData?.name ?? "",
        email: userData?.email ?? "",
      };
      void onChangePermission({
        subAccountId: subAccId,
        val: permission,
        permissionsId,
        type: type,
        userData: userDataPartial,
        agencyId: authUserDataQuery?.Agency?.id,
        page,
      });
    },
    [permisionSwitch],
  );

  return (
    <div>
      <Separator className="my-4" />
      <FormLabel> User Permissions</FormLabel>
      <FormDescription className="mb-4 font-normal">
        You can give Sub Account access to team member by turning on access
        control for each Sub Account. This is only visible to agency owners
      </FormDescription>
      <div className="flex flex-col gap-4">
        {subAccounts?.map((subAccount) => {
          return (
            <FormSwitch
              key={subAccount.id}
              isLoading={isLoading}
              subAccountPermissions={subAccountPermissions}
              onSwitchChange={onSwitchChange}
              subAccount={subAccount}
            />
          );
        })}
      </div>
    </div>
  );
};
export default Permission;
