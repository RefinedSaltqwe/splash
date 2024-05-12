"use client";
import Loader from "@/components/shared/Loader";
import { Switch } from "@/components/ui/switch";
import { useAction } from "@/hooks/useAction";
import { updateUserPermission } from "@/server/actions/update-permissions";
import {
  type UserWithPermissionsAndSubAccounts,
  type GetAuthUserDetails,
} from "@/types/prisma";
import { type User, type Role, type SubAccount } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import React, { memo, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type FormSwitchProps = {
  subAccountPermissions: UserWithPermissionsAndSubAccounts | null | undefined;
  role: Role;
  userData?: Partial<User>;
  subAccount: SubAccount;
  type: "agency" | "subaccount";
  authUserDataQuery: GetAuthUserDetails | undefined;
  page: "team" | "settings";
};

const FormSwitch: React.FC<FormSwitchProps> = ({
  subAccountPermissions,
  authUserDataQuery,
  userData,
  type,
  subAccount,
  role,
  page,
}) => {
  const queryClient = useQueryClient();
  const [isSwitched, setIsSwitched] = useState<boolean | undefined>(undefined);
  const initialRender = useRef<boolean>(false);
  const subAccountPermissionsDetails = subAccountPermissions?.Permissions.find(
    (p) => p.subAccountId === subAccount.id,
  );
  const { execute: onChangePermission, isLoading: permissionIsLoading } =
    useAction(updateUserPermission, {
      onSuccess: (data) => {
        toast.success(`Change user permission ${data.message}.`);
        void queryClient.invalidateQueries({
          queryKey: ["agencyWithSubAccount", userData?.id],
        });
      },
      onError: (error) => {
        toast.error(error);
      },
    });

  useEffect(() => {
    if (initialRender.current) {
      setIsSwitched(subAccountPermissionsDetails?.access);
    }

    initialRender.current = true;
  }, [subAccountPermissionsDetails?.access]);

  // If permission doesnt exist in database set switch to false
  useEffect(() => {
    if (
      subAccountPermissions !== undefined &&
      subAccountPermissions?.Permissions.length === 0
    ) {
      setIsSwitched(false);
    } else if (
      subAccountPermissions !== undefined &&
      subAccountPermissionsDetails === undefined
    ) {
      setIsSwitched(false);
    }
  }, [subAccountPermissions]);

  return (
    <div className="splash-border-color flex items-center justify-between rounded-lg border p-4">
      <div>
        <p>{subAccount.name}</p>
      </div>
      {permissionIsLoading || isSwitched === undefined ? (
        <Loader classNames="h-4 w-4 border-2 border-slate-400/80 dark:border-slate-500/80 animate-[spin_.5s_linear_infinite] brightness-100 saturate-200 !border-r-transparent" />
      ) : (
        <Switch
          disabled={permissionIsLoading || role === "AGENCY_OWNER"}
          checked={isSwitched}
          onCheckedChange={(permission) => {
            const userDataPartial = {
              id: userData?.id ?? "",
              name: userData?.name ?? "",
              email: userData?.email ?? "",
            };
            void onChangePermission({
              subAccountId: subAccount.id,
              val: permission,
              permissionsId: subAccountPermissionsDetails?.id ?? "",
              type: type,
              userData: userDataPartial,
              agencyId: authUserDataQuery?.Agency?.id,
              page,
            });
            setIsSwitched(permission);
          }}
        />
      )}
    </div>
  );
};
export default memo(FormSwitch);
