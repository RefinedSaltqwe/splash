"use client";
import Loader from "@/components/shared/Loader";
import { Switch } from "@/components/ui/switch";
import { type UserWithPermissionsAndSubAccounts } from "@/types/stripe";
import { type SubAccount } from "@prisma/client";
import React, { memo, useEffect, useState } from "react";

type FormSwitchProps = {
  subAccountPermissions: UserWithPermissionsAndSubAccounts | null | undefined;
  isLoading: boolean;
  subAccount: SubAccount;
  onSwitchChange: (
    subAccId: string,
    permission: boolean,
    permissionsId: string,
  ) => void;
};

const FormSwitch: React.FC<FormSwitchProps> = ({
  subAccountPermissions,
  isLoading,
  onSwitchChange,
  subAccount,
}) => {
  const [isSwitched, setIsSwitched] = useState<boolean | undefined>(undefined);
  const subAccountPermissionsDetails = subAccountPermissions?.Permissions.find(
    (p) => p.subAccountId === subAccount.id,
  );
  useEffect(() => {
    setIsSwitched(subAccountPermissionsDetails?.access);
  }, [subAccountPermissionsDetails?.access]);

  return (
    <div className="splash-border-color flex items-center justify-between rounded-lg border p-4">
      <div>
        <p>{subAccount.name}</p>
      </div>
      {isLoading || isSwitched === undefined ? (
        <Loader classNames="h-4 w-4 border-2 border-slate-200/40 animate-[spin_.5s_linear_infinite] brightness-100 saturate-200 border-r-transparent" />
      ) : (
        <Switch
          disabled={isLoading}
          checked={isSwitched}
          onCheckedChange={(permission) => {
            onSwitchChange(
              subAccount.id,
              permission,
              subAccountPermissionsDetails?.id ?? "",
            );
            setIsSwitched(permission);
          }}
        />
      )}
    </div>
  );
};
export default memo(FormSwitch);
