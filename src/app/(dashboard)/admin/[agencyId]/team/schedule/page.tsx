import React from "react";
import ClientData from "./_components/ClientData";
import { db } from "@/server/db";
import { getUsersExcludeCurrentAgencyOwner } from "@/server/actions/fetch";
import { type Agency } from "@prisma/client";

type LaborTrackingPageProps = {
  params: {
    agencyId: string;
  };
};

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const agencies: Agency[] = await db.agency.findMany();
  return agencies.map(({ id }) => {
    agencyId: id.toString();
  });
}

const LaborTrackingPage: React.FC<LaborTrackingPageProps> = async ({
  params,
}) => {
  const getEvents = db.laborTracking.findMany({
    where: {
      agencyId: params.agencyId,
    },
    include: {
      User: true,
    },
  });

  const getEmployees = getUsersExcludeCurrentAgencyOwner(params.agencyId);

  const [events, employees] = await Promise.all([getEvents, getEmployees]);

  return (
    <ClientData
      events={events ?? []}
      employees={employees ?? []}
      agencyId={params.agencyId}
    />
  );
};

export default LaborTrackingPage;
