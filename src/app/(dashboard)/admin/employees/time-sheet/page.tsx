import Card from "@/app/(dashboard)/_components/containers/Card";
import Heading from "@/components/shared/Heading";
import { getTimesheets, getUsers } from "@/server/actions/fetch";
import React from "react";
import ClientData from "./_components/ClientData";

const TimeSheetPage: React.FC = async () => {
  const timesheets = getTimesheets();
  const users = getUsers();

  const [usersData, timesheetsData] = await Promise.all([users, timesheets]);
  console.log(timesheetsData);
  return (
    <section className="flex w-full flex-col">
      <div className="flex items-center justify-between">
        <Heading
          title="Enter Time Sheet"
          subTitle="Time In/Time Out. Please enter time into the exact date as this will reflect to payroll."
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
