import Heading from "@/components/shared/Heading";
import Loader from "@/components/shared/Loader";
import Unauthorized from "@/components/shared/Unauthorized";
import { getAuthUserDetails } from "@/server/actions/fetch";
import { verifyAndAcceptInvitation } from "@/server/queries";
import { type GetAuthUserDetails } from "@/types/prisma";
import { currentUser } from "@clerk/nextjs";
import { type Plan } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";
import AdminRegistrationForm from "./[agencyId]/_components/form/AdminRegistrationForm";

type AdminPageProps = {
  searchParams: { plan: Plan; state: string; code: string };
};

function redirects(
  agencyId: string | null | undefined,
  user: GetAuthUserDetails,
  searchParams: {
    plan: Plan;
    state: string;
    code: string;
  },
) {
  if (agencyId) {
    if (user?.password && user.isTwoFactorEnabled) {
      console.log("Send Two-Factor Authentication Code");
    }
    if (user?.role === "SUBACCOUNT_GUEST" || user?.role === "SUBACCOUNT_USER") {
      return redirect("/subaccount");
    } else if (user?.role === "AGENCY_OWNER" || user?.role === "AGENCY_ADMIN") {
      if (searchParams.plan) {
        return redirect(`/admin/${agencyId}/billing?plan=${searchParams.plan}`);
      }
      if (searchParams.state) {
        const statePath = searchParams.state.split("___")[0];
        const stateAgencyId = searchParams.state.split("___")[1];
        if (!stateAgencyId) return <div>Not authorized</div>;
        return redirect(
          `/admin/${stateAgencyId}/${statePath}?code=${searchParams.code}`,
        );
      } else {
        return (
          <>
            <section className="flex h-full w-full flex-col items-center justify-center bg-background">
              <Loader classNames="h-8 w-8 border-2 animate-[spin_.5s_linear_infinite]" />
            </section>
            {redirect(`/admin/${agencyId}`)}
          </>
        );
      }
    } else {
      return <div>Not authorized</div>;
    }
  }
}

const AdminPage: React.FC<AdminPageProps> = async ({ searchParams }) => {
  const agencyId = await verifyAndAcceptInvitation();

  //get the users details
  const user = await getAuthUserDetails();
  if (user?.status === "Terminated") {
    return <Unauthorized />;
  }

  redirects(agencyId, user, searchParams);

  const authUser = await currentUser();

  if (!authUser) {
    redirect("/admin/sign-in");
  }
  //If the redirects fail reload the page
  if (user?.agencyId) {
    redirects(user.agencyId, user, searchParams);
    return;
  }
  return (
    <section className="flex w-full flex-col items-center justify-center">
      <div className="flex w-full flex-col md:max-w-screen-md">
        <Heading title="Create An Agency" />
        <AdminRegistrationForm
          data={{ companyEmail: authUser?.emailAddresses[0]!.emailAddress }}
        />
      </div>
    </section>
  );
};
export default AdminPage;
