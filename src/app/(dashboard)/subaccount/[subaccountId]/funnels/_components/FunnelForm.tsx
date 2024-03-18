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
import { type Funnel } from "@prisma/client";
import React, { type Dispatch, type SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import { type z } from "zod";

import FileUpload from "@/components/shared/FileUpload";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAction } from "@/hooks/useAction";
import { createFunnel } from "@/server/actions/create-funnel";
import { CreateFunnel } from "@/server/actions/create-funnel/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface CreateFunnelProps {
  defaultData?: Funnel;
  subAccountId: string;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
}

//CHALLENGE: Use favicons

const FunnelForm: React.FC<CreateFunnelProps> = ({
  defaultData,
  subAccountId,
  setIsOpen,
}) => {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof CreateFunnel>>({
    mode: "onChange",
    resolver: zodResolver(CreateFunnel),
    defaultValues: {
      name: defaultData?.name ?? "",
      description: defaultData?.description ?? "",
      favicon: defaultData?.favicon ?? "",
      subDomainName: defaultData?.subDomainName ?? "",
      subAccountId,
    },
  });

  useEffect(() => {
    if (defaultData) {
      form.reset({
        description: defaultData.description ?? "",
        favicon: defaultData.favicon ?? "",
        name: defaultData.name || "",
        subDomainName: defaultData.subDomainName ?? "",
      });
    }
  }, [defaultData]);

  const { execute: executeCreateFunnel, isLoading } = useAction(createFunnel, {
    onSuccess: (data) => {
      if (data) {
        toast.success("Success", {
          description: "Saved funnel details",
        });
        void queryClient.invalidateQueries({
          queryKey: ["funnels", subAccountId],
        });
      }
    },
    onError: (error) => {
      toast.error(error);
    },
    onComplete: () => {
      if (setIsOpen) setIsOpen(false);
    },
  });

  const onSubmit = (values: z.infer<typeof CreateFunnel>) => {
    if (!subAccountId) return;
    void executeCreateFunnel({
      ...values,
      subAccountId,
      defaultId: defaultData?.id,
      defaultLiveProducts: defaultData?.liveProducts,
    });
  };
  return (
    <Card className="splash-border-color flex-1 border-[1px] shadow-none">
      <CardHeader>
        <CardTitle>Funnel Details</CardTitle>
      </CardHeader>
      <CardContent>
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
                  <FormLabel>Funnel Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Funnel Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit more about this funnel."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subDomainName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sub domain</FormLabel>
                  <FormControl>
                    <Input placeholder="Sub domain for funnel" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="favicon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Favicon</FormLabel>
                  <FormControl>
                    <FileUpload
                      apiEndpoint="subaccountLogo"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="mt-4 w-20 justify-self-end"
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? (
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

export default FunnelForm;