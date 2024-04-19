"use client";
import Card from "@/app/(dashboard)/_components/containers/Card";
import SubAccountRegistrationForm from "@/app/(dashboard)/admin/[agencyId]/_components/form/SubAccountRegistrationForm";
import UserDetails from "@/app/(dashboard)/admin/[agencyId]/_components/form/UserDetails";
import {
  getAgencyByIdWithSubAccounts,
  getUserByEmail,
} from "@/server/actions/fetch";
import { type SubAccount } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import React from "react";

type ClientDataProps = {
  subaccountId: string;
  subAccount: SubAccount;
  emailAddress: string;
};

const ClientData: React.FC<ClientDataProps> = ({
  subaccountId,
  subAccount,
  emailAddress,
}) => {
  const { data: userDetails } = useQuery({
    queryKey: ["GetUserByEmail", emailAddress],
    queryFn: () => getUserByEmail(emailAddress),
  });

  const { data: agencyDetails } = useQuery({
    queryKey: ["agencyWithSubAccount", subaccountId],
    queryFn: () => getAgencyByIdWithSubAccounts(subAccount?.agencyId),
    enabled: !!subAccount,
  });

  if (!agencyDetails) return;
  const subAccounts = agencyDetails.SubAccount;
  return (
    <Card>
      <div className="flex flex-col gap-4 lg:!flex-row">
        <SubAccountRegistrationForm
          agencyDetails={agencyDetails}
          details={subAccount}
          userId={userDetails?.id ?? ""}
          userName={userDetails?.name ?? ""}
        />
        <UserDetails
          type="subaccount"
          id={subaccountId}
          subAccounts={subAccounts}
          userData={userDetails}
        />
      </div>
    </Card>
  );
};
export default ClientData;
