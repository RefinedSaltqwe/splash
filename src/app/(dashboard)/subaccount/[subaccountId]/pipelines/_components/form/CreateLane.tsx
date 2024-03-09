"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { createLane } from "@/server/actions/create-lane";
import { CreateLane } from "@/server/actions/create-lane/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { type LaneDetail } from "@/types/stripe";
import { useQueryClient } from "@tanstack/react-query";

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
  const form = useForm<z.infer<typeof CreateLane>>({
    mode: "onChange",
    resolver: zodResolver(CreateLane),
    defaultValues: {
      name: defaultData?.name ?? "",
      subAccountId,
      pipelineId,
      laneId: defaultData?.id,
      order: defaultData?.order,
    },
  });

  const { execute, isLoading } = useAction(createLane, {
    onSuccess: (data) => {
      toast.success("Success", {
        description: "Saved pipeline details",
      });
      if (data) {
        void queryClient.invalidateQueries({
          queryKey: ["lanes", pipelineId],
        });
        setAllLanes((prev) => [...prev, data]);
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

  const onSubmit = async (values: z.infer<typeof CreateLane>) => {
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
    <Card className="w-full ">
      <CardHeader>
        <CardTitle>Lane Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              disabled={isLoading}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lane Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Lane Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="mt-4 w-20" disabled={isLoading} type="submit">
              {form.formState.isSubmitting ? (
                <Loader classNames="h-4 w-4 border-2 border-slate-200/40 animate-[spin_.5s_linear_infinite] brightness-100 saturate-200 border-r-transparent" />
              ) : (
                "Save"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default LaneForm;
