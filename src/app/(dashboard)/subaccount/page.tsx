import Unauthorized from "@/components/shared/Unauthorized";
import { getAuthUserDetails } from "@/server/actions/fetch";
import { verifyAndAcceptInvitation } from "@/server/queries";
import { redirect } from "next/navigation";
import React from "react";

type SubAccountMainPageProps = {
  searchParams: { state: string; code: string }; // This is for srtipe
};

const SubAccountMainPage = async ({
  searchParams,
}: SubAccountMainPageProps) => {
  const agencyId = await verifyAndAcceptInvitation();

  if (!agencyId) {
    return <Unauthorized />;
  }

  const user = await getAuthUserDetails();
  if (!user) return;

  const getFirstSubaccountWithAccess = user.Permissions.find(
    (permission) => permission.access === true,
  );
  // if state exists from stripe
  if (searchParams.state) {
    const statePath = searchParams.state.split("___")[0];
    const stateSubaccountId = searchParams.state.split("___")[1];
    if (!stateSubaccountId) return <Unauthorized />;
    return redirect(
      `/subaccount/${stateSubaccountId}/${statePath}?code=${searchParams.code}`,
    );
  }

  if (getFirstSubaccountWithAccess) {
    return redirect(`/subaccount/${getFirstSubaccountWithAccess.subAccountId}`);
  }

  return <Unauthorized />;
};

export default SubAccountMainPage;
