"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { type Pipeline } from "@prisma/client";
import React from "react";
import { useForm } from "react-hook-form";
import { type z } from "zod";

import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAction } from "@/hooks/useAction";
import { cn } from "@/lib/utils";
import { createPipeline } from "@/server/actions/create-pipeline";
import { CreatePipeline } from "@/server/actions/create-pipeline/schema";
import { usePipelineStore } from "@/stores/usePipelineStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface CreatePipelineFormProps {
  defaultData?: Pipeline;
  subAccountId: string;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreatePipelineForm: React.FC<CreatePipelineFormProps> = ({
  defaultData,
  subAccountId,
  setIsOpen,
}) => {
  const queryClient = useQueryClient();
  const currentPipelines = usePipelineStore((state) => state.currentPipelines);
  const setPipelines = usePipelineStore((state) => state.setPipelines);
  const form = useForm<z.infer<typeof CreatePipeline>>({
    resolver: zodResolver(CreatePipeline),
    defaultValues: {
      name: defaultData?.name ?? "",
      subAccountId,
      pipelineId: defaultData?.id ?? undefined,
    },
  });

  const { execute: executeCreatePipeline, isLoading } = useAction(
    createPipeline,
    {
      onSuccess: (data) => {
        toast.success(`${data.name} has been created.`);
        setPipelines([...currentPipelines, data]);
        void queryClient.invalidateQueries({
          queryKey: ["pipelines", subAccountId],
        });
      },
      onError: (error) => {
        toast.error(error);
      },
      onComplete: () => {
        if (setIsOpen) {
          setIsOpen(false);
        }

        form.reset({
          name: defaultData?.name ?? "",
        });
      },
    },
  );

  const onSubmit = async (values: z.infer<typeof CreatePipeline>) => {
    void executeCreatePipeline(values);
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
                  Pipeline name
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    id="name"
                    autoComplete="family-name"
                    {...field}
                    className={cn(
                      "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                      "splash-base-input splash-inputs",
                    )}
                    placeholder="Name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex w-full flex-row justify-end">
            <Button className="w-full" disabled={isLoading} type="submit">
              {isLoading ? (
                <Loader classNames="h-4 w-4 border-2 border-slate-200/40 animate-[spin_.5s_linear_infinite] brightness-100 saturate-200 border-r-transparent" />
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

export default CreatePipelineForm;
