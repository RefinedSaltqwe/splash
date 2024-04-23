"use client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useAction } from "@/hooks/useAction";
import { cn, formatDateTime, getFirstAndLastDatesNextWeek } from "@/lib/utils";
import { createTimesheet } from "@/server/actions/create-timesheet";
import { CreateTimesheet } from "@/server/actions/create-timesheet/schema";
import { useCurrentUserStore } from "@/stores/useCurrentUser";
import { useGenerateTimesheetModal } from "@/stores/useGenerateTimesheetModal";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";
import Loader from "./Loader";

type GenerateTimesheetFormProps = {
  className?: string;
};

const GenerateTimesheetForm: React.FC<GenerateTimesheetFormProps> = ({
  className,
}) => {
  const onClose = useGenerateTimesheetModal((state) => state.onClose);
  const agencyId = useCurrentUserStore((state) => state.agencyId);

  const { execute: executeCreateTimesheet, isLoading: createLoading } =
    useAction(createTimesheet, {
      onSuccess: (data) => {
        if (data.count === 0) {
          toast.error(
            `Timesheet for ${
              formatDateTime(getFirstAndLastDatesNextWeek(1)).dateOnly
            } to ${
              formatDateTime(getFirstAndLastDatesNextWeek(7)).dateOnly
            } has already been created.`,
          );
        } else {
          toast.success(
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
        } else if (error.includes("no-other-users")) {
          toast.error("Cannot create timesheet", {
            description:
              "You need to add user to be able to generate timesheet.",
          });
        }
        toast.error(error, {
          duration: 5000,
        });
      },
      onComplete: () => {
        onClose();
      },
    });

  const form = useForm<z.infer<typeof CreateTimesheet>>({
    resolver: zodResolver(CreateTimesheet),
    defaultValues: {
      dateFr: getFirstAndLastDatesNextWeek(1).toString(), // get the next week from lastest timesheet dateTo instead
      dateTo: getFirstAndLastDatesNextWeek(7).toString(),
      agencyId: agencyId!,
    },
  });

  function onSubmit(values: z.infer<typeof CreateTimesheet>) {
    void executeCreateTimesheet({
      dateFr: values.dateFr,
      dateTo: values.dateTo,
      agencyId: agencyId!,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div
          className={cn(
            "mt-4 flex w-full flex-col justify-end gap-3 md:flex-row",
            className,
          )}
        >
          <Button
            type="button"
            onClick={onClose}
            className="w-full"
            variant={"just_outline"}
          >
            Close
          </Button>
          <Button
            type="submit"
            variant={"default"}
            disabled={createLoading}
            className="w-full"
          >
            <span className="sr-only">Submit</span>
            {createLoading ? (
              <Loader classNames="h-4 w-4 border-2 border-white/80 animate-[spin_.5s_linear_infinite] brightness-100 saturate-200 !border-r-transparent" />
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default GenerateTimesheetForm;
