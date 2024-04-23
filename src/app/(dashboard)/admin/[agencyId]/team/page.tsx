import Unauthorized from "@/components/shared/Unauthorized";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

type TeamPageProps = {
  params: {
    agencyId: string;
  };
};

const TeamPage: React.FC<TeamPageProps> = async ({ params }) => {
  const session = await currentUser();
  if (session) {
    return redirect(`/admin/${params.agencyId}/team/list`);
  } else {
    return <Unauthorized />;
  }
};
export default TeamPage;
