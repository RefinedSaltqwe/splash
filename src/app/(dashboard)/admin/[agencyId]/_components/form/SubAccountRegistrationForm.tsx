"use client";
import Card from "@/app/(dashboard)/_components/containers/Card";
import FileUpload from "@/components/shared/FileUpload";
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
import { useAction } from "@/hooks/useAction";
import { cn } from "@/lib/utils";
import { createSubaccount } from "@/server/actions/create-subaccount";
import { CreateSubaccount } from "@/server/actions/create-subaccount/schema";
import { useSubaccountModal } from "@/stores/useSubaccountModal";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Agency, type SubAccount } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";

type SubAccountRegistrationFormProps = {
  agencyDetails: Agency;
  details?: Partial<SubAccount>;
  userId: string;
  userName: string;
};

const SubAccountRegistrationForm: React.FC<SubAccountRegistrationFormProps> = ({
  agencyDetails,
  userId,
  userName,
  details,
}) => {
  const onClose = useSubaccountModal((state) => state.onClose);
  const router = useRouter();
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof CreateSubaccount>>({
    resolver: zodResolver(CreateSubaccount),
    defaultValues: {
      id: details?.id ?? "",
      userName: userName ?? "",
      agencyId: agencyDetails.id ?? "",
      name: details?.name ?? "",
      companyEmail: details?.companyEmail ?? "",
      companyPhone: details?.companyPhone ?? "",
      address: details?.address ?? "",
      city: details?.city ?? "",
      zipCode: details?.zipCode ?? "",
      state: details?.state ?? "",
      country: details?.country ?? "",
      subAccountLogo: details?.subAccountLogo ?? "",
    },
  });

  const {
    execute: executeCreateSubaccount,
    isLoading: createSubaccountIsLoading,
  } = useAction(createSubaccount, {
    onSuccess: (data) => {
      if (data?.id) {
        void queryClient.invalidateQueries({
          queryKey: ["getAuthUserDetails"],
        });
        toast.success(`Subaccount ${data.name} has been created`);
        router.refresh();
      }
    },
    onError: (error) => {
      toast.error(error);
    },
    onComplete: () => {
      onClose();
    },
  });

  function onSubmit(values: z.infer<typeof CreateSubaccount>) {
    void executeCreateSubaccount(values);
    form.reset();
  }
  return (
    <div className="mt-3 flex w-full flex-col">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-12">
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-slate-200 dark:border-slate-700">
              <div className="col-span-1 grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="col-span-full">
                  <FormField
                    control={form.control}
                    name="subAccountLogo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          htmlFor="agencyLogo"
                          className="block text-sm font-medium leading-6 text-foreground"
                        >
                          Cover photo
                        </FormLabel>
                        <FormControl>
                          <FileUpload
                            apiEndpoint="agencyLogo"
                            onChange={field.onChange}
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="sm:col-span-3">
                  <div className="mt-2">
                    <FormField
                      //   disabled={isLoading}
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel
                            htmlFor="name"
                            className="block text-sm font-medium leading-6 text-foreground"
                          >
                            Account name
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className={cn(
                                "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                                "splash-base-input splash-inputs",
                              )}
                              placeholder="Your agency name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <div className="mt-2">
                    <FormField
                      control={form.control}
                      name="companyEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel
                            htmlFor="companyEmail"
                            className="block text-sm font-medium leading-6 text-foreground"
                          >
                            Account Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              id="companyEmail"
                              autoComplete="companyEmail"
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
                      control={form.control}
                      name="companyPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel
                            htmlFor="companyPhone"
                            className="block text-sm font-medium leading-6 text-foreground"
                          >
                            Account Phone Number
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              id="companyPhone"
                              autoComplete="companyPhone"
                              {...field}
                              className={cn(
                                "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                                "splash-base-input splash-inputs",
                              )}
                              placeholder="Company Phone"
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
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel
                            htmlFor="address"
                            className="block text-sm font-medium leading-6 text-foreground"
                          >
                            Address
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              id="address"
                              autoComplete="address"
                              {...field}
                              className={cn(
                                "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                                "splash-base-input splash-inputs",
                              )}
                              placeholder="123 st..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <div className="mt-2">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel
                            htmlFor="city"
                            className="block text-sm font-medium leading-6 text-foreground"
                          >
                            City
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              id="city"
                              autoComplete="city"
                              {...field}
                              className={cn(
                                "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                                "splash-base-input splash-inputs",
                              )}
                              placeholder="City"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <div className="mt-2">
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel
                            htmlFor="state"
                            className="block text-sm font-medium leading-6 text-foreground"
                          >
                            State
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              id="state"
                              autoComplete="state"
                              {...field}
                              className={cn(
                                "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                                "splash-base-input splash-inputs",
                              )}
                              placeholder="State"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <div className="mt-2">
                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel
                            htmlFor="zipCode"
                            className="block text-sm font-medium leading-6 text-foreground"
                          >
                            Zip code
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              id="zipCode"
                              autoComplete="zipCode"
                              {...field}
                              className={cn(
                                "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                                "splash-base-input splash-inputs",
                              )}
                              placeholder="Zip Code"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="mb-7 sm:col-span-full">
                  <div className="mt-2">
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel
                            htmlFor="country"
                            className="block text-sm font-medium leading-6 text-foreground"
                          >
                            Country
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              id="country"
                              autoComplete="country"
                              {...field}
                              className={cn(
                                "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                                "splash-base-input splash-inputs",
                              )}
                              placeholder="Country"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end">
            <Button
              type="submit"
              disabled={createSubaccountIsLoading}
              className="w-full"
            >
              {createSubaccountIsLoading ? (
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

export default SubAccountRegistrationForm;
