"use client";
import Card from "@/app/(dashboard)/_components/containers/Card";
import FloatingBottomContainer from "@/components/shared/FloatingBottomContainer";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/useAction";
import { cn, formatDateTime, getFirstAndLastDatesNextWeek } from "@/lib/utils";
import { createTimesheet } from "@/server/actions/create-timesheet";
import { updateTimesheets } from "@/server/actions/update-timesheet";
import { useCurrentUserStore } from "@/stores/useCurrentUser";
import { type TimesheetWithInputTimes } from "@/types/prisma";
import { type User } from "@prisma/client";
import { ChevronUp } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import TimeSheetTable from "./TimeSheetTable";

type ClientDataProps = {
  timesheetsData: TimesheetWithInputTimes[];
  usersData: User[];
};

const ClientData: React.FC<ClientDataProps> = ({
  timesheetsData,
  usersData,
}) => {
  const agencyId = useCurrentUserStore((state) => state.agencyId);
  const [timesheets, setTimesheets] = useState<TimesheetWithInputTimes[]>([]);
  const [isContentHidden, setIsContentHidden] = useState<string[]>([]);

  const { execute: executeCreateTimesheet, isLoading: creatingTimesheet } =
    useAction(createTimesheet, {
      onSuccess: (data) => {
        if (data.count > 0) {
          toast.loading(
            `${data.count > 1 ? "Timesheets" : "Timesheet"} for ${data.count} ${
              data.count > 1 ? "employees have" : "employee has"
            } been created.`,
            {
              description: `${formatDateTime(data.dateFr).dateOnly} to ${
                formatDateTime(data.dateTo).dateOnly
              }`,
            },
          );
        }
      },
      onError: (error) => {
        if (error.includes("Foreign key constraint failed")) {
          toast.warning(`Timesheets were already created.`);
          return;
        }
        toast.error(error, {
          duration: 5000,
        });
      },
    });

  const { execute: updateTimesheetsData, isLoading: isLoadingUpdate } =
    useAction(updateTimesheets, {
      onSuccess: (data) => {
        setTimesheets((prev) => [
          ...prev.map((timesheet) => {
            const newTimesheet = timesheet;
            newTimesheet!.status = data.status;
            return newTimesheet;
          }),
        ]);
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

  useEffect(() => {
    if (timesheetsData.length === 0) {
      const time = setTimeout(() => {
        void executeCreateTimesheet({
          dateFr: getFirstAndLastDatesNextWeek(1).toString(), // get the next week from lastest timesheet dateTo instead
          dateTo: getFirstAndLastDatesNextWeek(7).toString(),
          agencyId: agencyId!,
        });
      }, 1000);

      return () => clearTimeout(time);
    }
  }, [timesheetsData]);
  useEffect(() => {
    setTimesheets(timesheetsData ? timesheetsData : []);
  }, [timesheetsData]);

  const onSubmit = (status: "draft" | "submitted" | "approved") => {
    void updateTimesheetsData({
      status,
      timesheets: [...timesheets],
    });
  };
  if (timesheets.length === 0) {
    return (
      <div className="flex w-full flex-col">
        {creatingTimesheet && (
          <div className="flex w-full flex-row items-center px-2 pt-4 ">
            <Loader classNames="h-4 w-4 border-2 border-slate-400/80 dark:border-slate-500/80 animate-[spin_.5s_linear_infinite] brightness-100 saturate-200 !border-r-transparent" />
            <h2 className="ml-2 font-normal text-muted-foreground">
              Creating timesheet. Please wait...
            </h2>
          </div>
        )}
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
                {isLoadingUpdate ? (
                  <Button variant={"card_outline"} disabled>
                    <Loader classNames="h-4 w-4 border-2 border-slate-400/80 dark:border-slate-500/80 animate-[spin_.5s_linear_infinite] brightness-100 saturate-200 !border-r-transparent" />
                  </Button>
                ) : (
                  <>
                    <Button
                      variant={"card_outline"}
                      onClick={() => onSubmit("draft")}
                    >
                      Save as draft
                    </Button>
                    <Button onClick={() => onSubmit("submitted")}>
                      Submit
                    </Button>
                  </>
                )}
              </>
            ) : timesheets[0]!.status === "approved" ? (
              <span className="">Approved</span>
            ) : (
              <>
                <span className="">Submitted</span>
                <Button
                  variant={"card_outline"}
                  onClick={() => onSubmit("draft")}
                >
                  {isLoadingUpdate ? (
                    <Loader classNames="h-4 w-4 border-2 border-slate-400/80 dark:border-slate-500/80 animate-[spin_.5s_linear_infinite] brightness-100 saturate-200 !border-r-transparent" />
                  ) : (
                    "Edit"
                  )}
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
