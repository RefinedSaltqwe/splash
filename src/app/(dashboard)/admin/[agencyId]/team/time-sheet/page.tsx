import Card from "@/app/(dashboard)/_components/containers/Card";
import Heading from "@/components/shared/Heading";
import { formatDateTime, getFirstAndLastDatesNextWeek } from "@/lib/utils";
import { getLatestTimeSheets, getUsers } from "@/server/actions/fetch";
import React from "react";
import ClientData from "./_components/ClientData";

type TimeSheetPagePops = {
  params: {
    agencyId: string;
  };
};

const TimeSheetPage: React.FC<TimeSheetPagePops> = async ({ params }) => {
  const timesheets = getLatestTimeSheets(params.agencyId);
  const users = getUsers(params.agencyId);

  const [usersData, timesheetsData] = await Promise.all([users, timesheets]);

  return (
    <section className="flex w-full flex-col">
      <div className="flex items-center justify-between">
        <Heading
          title={
            timesheetsData?.length === 0 ? "Loading..." : "Enter Time Sheet"
          }
          subTitle={`Time In/Time Out for ${
            timesheetsData
              ? formatDateTime(
                  timesheetsData[0]?.dateFr ?? getFirstAndLastDatesNextWeek(1),
                ).dateOnly
              : ""
          } to ${
            timesheetsData
              ? formatDateTime(
                  timesheetsData[0]?.dateTo ?? getFirstAndLastDatesNextWeek(7),
                ).dateOnly
              : ""
          }`}
        />
      </div>

      <Card padding={false}>
        <ClientData
          timesheetsData={timesheetsData ? timesheetsData : []}
          usersData={usersData ? usersData : []}
        />
      </Card>
    </section>
  );
};
export default TimeSheetPage;
