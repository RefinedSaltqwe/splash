"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { type Lane } from "@prisma/client";
import React, { type Dispatch, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { type z } from "zod";

import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAction } from "@/hooks/useAction";
import { cn } from "@/lib/utils";
import { upsertLane } from "@/server/actions/upsert-lane";
import { UpsertLane } from "@/server/actions/upsert-lane/schema";
import { type LaneDetail } from "@/types/stripe";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface CreateLaneFormProps {
  subAccountId: string;
  defaultData?: Lane;
  pipelineId: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setAllLanes: Dispatch<SetStateAction<[] | LaneDetail[]>>;
}

const LaneForm: React.FC<CreateLaneFormProps> = ({
  defaultData,
  setIsOpen,
  pipelineId,
  subAccountId,
  setAllLanes,
}) => {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof UpsertLane>>({
    mode: "onChange",
    resolver: zodResolver(UpsertLane),
    defaultValues: {
      name: defaultData?.name ?? "",
      subAccountId,
      pipelineId,
      laneId: defaultData?.id,
      order: defaultData?.order,
    },
  });

  const { execute, isLoading } = useAction(upsertLane, {
    onSuccess: (data) => {
      if (data) {
        toast.success("Success", {
          description: "New lane added.",
        });
        void queryClient.invalidateQueries({
          queryKey: ["lanes", pipelineId],
        });
        setAllLanes((prev) => {
          let count = 0;
          const newLanes = prev.map((lane) => {
            if (lane.id === data.id) {
              count++;
              return data;
            }
            return lane;
          });

          if (count === 0) {
            newLanes.push(data);
          }

          return newLanes;
        });
      }
    },
    onError: (error) => {
      toast.error(error);
    },
    onComplete: () => {
      setIsOpen(false);
      form.reset();
    },
  });

  const onSubmit = async (values: z.infer<typeof UpsertLane>) => {
    if (!pipelineId) return;
    void execute({
      name: values.name,
      subAccountId,
      pipelineId,
      laneId: defaultData?.id,
      order: defaultData?.order,
    });
  };
  return (
    <div className="space-y-12 px-1">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  htmlFor="name"
                  className="block text-sm font-medium leading-6 text-foreground"
                >
                  Lane name
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    id="name"
                    autoComplete="lane-name"
                    {...field}
                    className={cn(
                      "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                      "splash-base-input splash-inputs",
                    )}
                    placeholder="Lane name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex w-full flex-row justify-end">
            <Button className="w-full" disabled={isLoading} type="submit">
              {isLoading ? (
                <Loader classNames="h-4 w-4 border-2 border-slate-400/80 dark:border-slate-500/80 animate-[spin_.5s_linear_infinite] brightness-100 saturate-200 !border-r-transparent" />
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LaneForm;
