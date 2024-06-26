"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAction } from "@/hooks/useAction";
import { cn } from "@/lib/utils";
import { createService } from "@/server/actions/create-services";
import { updateService } from "@/server/actions/update-services";
import { UpdateService } from "@/server/actions/update-services/schema";
import { useCurrentUserStore } from "@/stores/useCurrentUser";
import { useServiceModal } from "@/stores/useServiceModal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import React, { lazy } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";

const Loader = lazy(() => import("@/components/shared/Loader"));

type ServiceFormProps = {
  className?: string;
};

const ServiceForm: React.FC<ServiceFormProps> = ({ className }) => {
  const agencyId = useCurrentUserStore((state) => state.agencyId);
  const onClose = useServiceModal((state) => state.onClose);
  const id = useServiceModal((state) => state.drawerId);
  const name = useServiceModal((state) => state.drawerName);
  const queryClient = useQueryClient();

  const { execute: create, isLoading: createLoading } = useAction(
    createService,
    {
      onSuccess: (data) => {
        toast.success(`New service "${data.name}" created.`);
        void queryClient.invalidateQueries({
          queryKey: ["serviceTypes", data.agencyId],
        });
      },
      onError: (error) => {
        toast.error(error, {
          duration: 5000,
        });
      },
      onComplete: () => {
        onClose();
      },
    },
  );

  const { execute: update, isLoading: updateLoading } = useAction(
    updateService,
    {
      onSuccess: (data) => {
        toast.success(`"${name}" has been updated to "${data.name}".`);
        void queryClient.invalidateQueries({
          queryKey: ["serviceTypes", data.agencyId],
        });
      },
      onError: (error) => {
        toast.error(error, {
          duration: 5000,
        });
      },
      onComplete: () => {
        onClose();
      },
    },
  );
  const form = useForm<z.infer<typeof UpdateService>>({
    resolver: zodResolver(UpdateService),
    defaultValues:
      id.length > 0
        ? {
            id,
            name,
          }
        : {
            id: "",
            name: "",
          },
  });
  function onSubmit(values: z.infer<typeof UpdateService>) {
    if (id.length > 0) {
      void update({
        id,
        name: values.name,
      });
    } else {
      void create({
        name: values.name,
        agencyId: agencyId!,
      });
      form.reset();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className={cn("space-y-12", className)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="text"
                    autoComplete="service-name"
                    {...field}
                    className={cn(
                      "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                      "splash-base-input splash-inputs",
                    )}
                    placeholder="Service"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div
          className={cn(
            "mt-3 flex w-full flex-col justify-end gap-3 md:flex-row",
            className,
          )}
        >
          <Button
            type="submit"
            variant={"default"}
            className="w-full"
            disabled={updateLoading || createLoading}
          >
            <span className="sr-only">Save</span>
            {updateLoading || createLoading ? (
              <Loader classNames="h-4 w-4 border-2 border-white/80 animate-[spin_.5s_linear_infinite] brightness-100 saturate-200 !border-r-transparent" />
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default ServiceForm;
