"use client";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAction } from "@/hooks/useAction";
import { cn } from "@/lib/utils";
import { upsertContact } from "@/server/actions/upsert-contact";
import { UpsertContact } from "@/server/actions/upsert-contact/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";

interface ContactUserFormProps {
  subaccountId: string;
  modal?: boolean;
}

const ContactUserForm: React.FC<ContactUserFormProps> = ({
  subaccountId,
  modal = false,
}) => {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof UpsertContact>>({
    mode: "onChange",
    resolver: zodResolver(UpsertContact),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const { execute: executeUpsertContact, isLoading } = useAction(
    upsertContact,
    {
      onSuccess: (data) => {
        toast.success(`New contact added | ${data.name}`);
        void queryClient.invalidateQueries({
          queryKey: ["subaccountWithContact", subaccountId],
        });
      },
      onError: (error) => {
        toast.error(error);
      },
    },
  );

  const handleSubmit = async (values: z.infer<typeof UpsertContact>) => {
    void executeUpsertContact({
      ...values,
      subaccountId,
    });
  };

  return (
    <Card className={cn("w-full", modal && "bg-transparent p-0")}>
      {!modal && (
        <CardHeader>
          <CardTitle>Contact Info</CardTitle>
          <CardDescription>
            You can assign tickets to contacts and set a value for each contact
            in the ticket.
          </CardDescription>
        </CardHeader>
      )}

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Name"
                      {...field}
                      className={cn(
                        "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                        "splash-base-input splash-inputs",
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Email"
                      {...field}
                      className={cn(
                        "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                        "splash-base-input splash-inputs",
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="mt-4" disabled={isLoading} type="submit">
              {isLoading ? (
                <Loader classNames="h-4 w-4 border-2 border-white/80 animate-[spin_.5s_linear_infinite] brightness-100 saturate-200 !border-r-transparent" />
              ) : (
                "Save Contact Details!"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ContactUserForm;
