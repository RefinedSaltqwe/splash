"use client";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAction } from "@/hooks/useAction";
import { cn } from "@/lib/utils";
import { sendInvitation } from "@/server/actions/send-invitation";
import { SendInvitation } from "@/server/actions/send-invitation/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";

type SendInvitationComponentProps = {
  agencyId: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const SendInvitationComponent: React.FC<SendInvitationComponentProps> = ({
  agencyId,
  setIsOpen,
}) => {
  const {
    execute: executeSendEmailInvitation,
    isLoading: isLoadingSendEmailInvitation,
  } = useAction(sendInvitation, {
    onSuccess: (data) => {
      toast.success(`Invitational link sent to ${data.email}.`);
    },
    onError: (error) => {
      if (error.includes("Unique constraint failed on the fields: (`email`)"))
        toast.error("Link already send to email", {
          duration: 5000,
        });
    },
    onComplete: () => {
      setIsOpen(false);
    },
  });

  const form = useForm<z.infer<typeof SendInvitation>>({
    resolver: zodResolver(SendInvitation),
    defaultValues: {
      email: "",
      role: "SUBACCOUNT_USER",
      agencyId,
    },
  });

  const onSubmit = async (values: z.infer<typeof SendInvitation>) => {
    void executeSendEmailInvitation(values);
    form.reset();
  };

  return (
    <div className="flex w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-6"
        >
          <div className="space-y-12">
            <div className="grid grid-cols-1 gap-x-8 gap-y-10">
              <div className="col-span-1 grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-full">
                  <div className="mt-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel
                            htmlFor="userEmail"
                            className="block text-sm font-medium leading-6 text-foreground"
                          >
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              id="userEmail"
                              autoComplete="userEmail"
                              {...field}
                              className={cn(
                                "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                                "splash-base-input splash-inputs",
                              )}
                              placeholder="Email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="sm:col-span-full">
                  <div className="mt-2">
                    <FormField
                      disabled={form.formState.isSubmitting}
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>User role</FormLabel>
                          <Select
                            onValueChange={(value) => field.onChange(value)}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger
                                className={cn(
                                  "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                                  "splash-base-input splash-inputs",
                                )}
                              >
                                <SelectValue placeholder="Select user role..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent
                              className={cn(
                                "z-[75] border-[1px] border-slate-200 bg-card font-normal placeholder:text-gray-400 dark:border-slate-700 dark:placeholder:text-gray-600",
                              )}
                            >
                              <SelectItem
                                value="AGENCY_ADMIN"
                                className="hover:!bg-muted-foreground/5"
                              >
                                Agency Admin
                              </SelectItem>
                              <SelectItem
                                value="SUBACCOUNT_USER"
                                className="hover:!bg-muted-foreground/5"
                              >
                                Sub Account User
                              </SelectItem>
                              <SelectItem
                                value="SUBACCOUNT_GUEST"
                                className="hover:!bg-muted-foreground/5"
                              >
                                Sub Account Guest
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full">
            <Button
              disabled={isLoadingSendEmailInvitation}
              type="submit"
              className="w-full"
            >
              {isLoadingSendEmailInvitation ? (
                <Loader classNames="h-4 w-4 border-2 border-white/80 animate-[spin_.5s_linear_infinite] brightness-100 saturate-200 !border-r-transparent" />
              ) : (
                "Send invitation"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SendInvitationComponent;
