import Card from "@/app/(dashboard)/_components/containers/Card";
import Heading from "@/components/shared/Heading";
import { getTimesheets } from "@/server/actions/fetch";
import React from "react";
import ClientData from "./_components/ClientData";
import GenerateTimesheetButton from "@/components/shared/GenerateTimesheetButton";

type TimeSheetPagePops = {
  params: {
    agencyId: string;
  };
};

const TimeSheetPage: React.FC<TimeSheetPagePops> = async ({ params }) => {
  const timesheets = await getTimesheets(params.agencyId);

  const uniqueTimesheets = [
    ...new Map(timesheets?.map((item) => [item?.groupId, item])).values(),
  ];

  return (
    <section className="flex w-full flex-col">
      <div className="flex items-center justify-between">
        <Heading title={"Timesheet List"} />
        <GenerateTimesheetButton />
      </div>

      <Card padding={false}>
        <ClientData timesheetsData={uniqueTimesheets ? uniqueTimesheets : []} />
      </Card>
    </section>
  );
};
export default TimeSheetPage;
