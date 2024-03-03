"use client";
import { cn, formatDateTime } from "@/lib/utils";
import { type TimesheetWithInputTimes } from "@/types/prisma";
import { type User } from "@prisma/client";
import { ChevronUp } from "lucide-react";
import React, { useEffect, useState } from "react";
import TimeSheetTable from "./TimeSheetTable";
import FloatingBottomContainer from "@/components/shared/FloatingBottomContainer";
import Card from "@/app/(dashboard)/_components/containers/Card";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/useAction";
import { updateTimesheets } from "@/server/actions/update-timesheet";
import { toast } from "sonner";
import Loader from "@/components/shared/Loader";

type ClientDataProps = {
  timesheetsData: TimesheetWithInputTimes[];
  usersData: User[];
};

const ClientData: React.FC<ClientDataProps> = ({
  timesheetsData,
  usersData,
}) => {
  const [timesheets, setTimesheets] = useState<TimesheetWithInputTimes[]>([]);
  const [isContentHidden, setIsContentHidden] = useState<string[]>([]);

  const { execute: updateTimesheetsData, isLoading: isLoadingUpdate } =
    useAction(updateTimesheets, {
      onSuccess: (data) => {
        toast.success(
          `${data.count > 1 ? "Timesheets" : "Timesheet"} for ${data.count} ${
            data.count > 1 ? "employees have" : "employee has"
          } been updated.`,
          {
            description: `${formatDateTime(data.dateFr).dateOnly} to ${
              formatDateTime(data.dateTo).dateOnly
            }`,
          },
        );
      },
      onError: (error) => {
        toast.error(error, {
          duration: 5000,
        });
      },
    });

  // console.log("Client Data Timesheets: ", timesheets);
  useEffect(() => {
    setTimesheets(timesheetsData ? timesheetsData : []);
  }, [timesheetsData]);

  const onSubmit = (status: "draft" | "submit") => {
    void updateTimesheetsData({
      status,
      timesheets: [...timesheets],
    });
  };
  if (timesheets.length === 0) {
    return (
      <div className="flex w-full flex-col">
        <TimeSheetTable.Skeleton />
        <TimeSheetTable.Skeleton />
        <TimeSheetTable.Skeleton />
      </div>
    );
  }
  return (
    <div className="flex w-full flex-col py-5">
      {timesheetsData?.map((timesheet) => {
        const user = usersData?.filter((user) => user.id === timesheet?.userId);
        return (
          <div
            key={timesheet?.id}
            className="flex w-full flex-col border-b-[1px] border-b-slate-200 dark:border-b-slate-700"
          >
            <div className="flex w-full flex-col">
              <div
                onClick={() =>
                  setIsContentHidden((prev) => {
                    if (prev.includes(timesheet!.userId)) {
                      return [...prev.filter((id) => id !== timesheet!.userId)];
                    }
                    return [...prev, timesheet!.userId];
                  })
                }
                className="group flex w-full cursor-pointer flex-row items-center justify-between border-l-3 border-primary bg-slate-100/80 px-5 py-4 dark:bg-slate-500/20 dark:hover:bg-slate-500/20"
              >
                <span className="group-hover:underline">{user[0]?.name}</span>
                <div className="text-muted-foreground">
                  <ChevronUp
                    className={cn(
                      isContentHidden.includes(timesheet!.userId)
                        ? "rotate-180"
                        : "text-muted-foreground",
                      "h-5 w-5 shrink-0",
                    )}
                    aria-hidden="true"
                  />
                </div>
              </div>
              <div
                className={cn(
                  "my-5 w-full flex-row",
                  isContentHidden.includes(timesheet!.userId)
                    ? "hidden"
                    : "flex",
                )}
              >
                <TimeSheetTable
                  timesheets={timesheets}
                  setTimesheets={setTimesheets}
                  stagnantTimesheet={timesheet}
                />
              </div>
            </div>
          </div>
        );
      })}

      <FloatingBottomContainer padding={false}>
        <Card glass={true} padding={false} rounded={false}>
          <div className="flex w-full flex-row items-center justify-end gap-3">
            {timesheets[0]!.status === "draft" ? (
              <>
                <Button
                  variant={"card_outline"}
                  onClick={() => onSubmit("draft")}
                >
                  Draft
                </Button>
                <Button onClick={() => onSubmit("submit")}>
                  {isLoadingUpdate ? (
                    <Loader classNames="h-4 w-4 border-2 border-slate-200/40 animate-[spin_.5s_linear_infinite] brightness-100 saturate-200 border-r-transparent" />
                  ) : (
                    "Submit"
                  )}
                </Button>
              </>
            ) : (
              <>
                <span className="">Submitted</span>
                <Button
                  variant={"card_outline"}
                  onClick={() => onSubmit("draft")}
                >
                  Edit
                </Button>
              </>
            )}
          </div>
        </Card>
      </FloatingBottomContainer>
    </div>
  );
};
export default ClientData;
