"use client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useAction } from "@/hooks/useAction";
import { cn, formatDateTime, getDayOfNextWeek } from "@/lib/utils";
import { createTimesheet } from "@/server/actions/create-timesheet";
import { CreateTimesheet } from "@/server/actions/create-timesheet/schema";
import { useGenerateTimesheetModal } from "@/stores/useGenerateTimesheetModal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import React, { lazy } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";

const Loader = lazy(() => import("@/components/shared/Loader"));

type GenerateTimesheetFormProps = {
  className?: string;
};

const GenerateTimesheetForm: React.FC<GenerateTimesheetFormProps> = ({
  className,
}) => {
  const onClose = useGenerateTimesheetModal((state) => state.onClose);
  const queryClient = useQueryClient();

  const { execute: create, isLoading: createLoading } = useAction(
    createTimesheet,
    {
      onSuccess: (data) => {
        if (data.count === 0) {
          toast.warning(
            `Timesheets for ${formatDateTime(data.dateFr).dateOnly} to ${
              formatDateTime(data.dateTo).dateOnly
            } were already created.`,
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
          void queryClient.invalidateQueries({
            queryKey: ["timesheets"],
          });
        }
      },
      onError: (error) => {
        if (error.includes("Foreign key constraint failed")) {
          toast.warning(`Timesheets for were already created.`);
          return;
        }
        toast.error(error, {
          duration: 5000,
        });
      },
      onComplete: () => {
        onClose();
      },
    },
  );

  const form = useForm<z.infer<typeof CreateTimesheet>>({
    resolver: zodResolver(CreateTimesheet),
    defaultValues: {
      dateFr: getDayOfNextWeek(1),
      dateTo: getDayOfNextWeek(7),
    },
  });

  function onSubmit(values: z.infer<typeof CreateTimesheet>) {
    void create({
      dateFr: values.dateFr,
      dateTo: values.dateTo,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div
          className={cn(
            "mt-4 flex items-center justify-end gap-x-6",
            className,
          )}
        >
          <Button type="button" variant={"ghost"} onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant={"default"} disabled={createLoading}>
            <span className="sr-only">Submit</span>
            {createLoading ? (
              <>
                {`Please wait `}
                <Loader classNames="ml-2 h-4 w-4 border-2 border-slate-200/40 animate-[spin_.5s_linear_infinite] brightness-100 saturate-200 border-r-transparent" />
              </>
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
