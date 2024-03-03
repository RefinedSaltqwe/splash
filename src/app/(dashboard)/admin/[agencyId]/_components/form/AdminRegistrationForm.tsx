"use client";
import Card from "@/app/(dashboard)/_components/containers/Card";
import FileUpload from "@/components/shared/FileUpload";
import Loader from "@/components/shared/Loader";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useAction } from "@/hooks/useAction";
import { cn } from "@/lib/utils";
import { createAdmin } from "@/server/actions/create-agency";
import { CreateAdmin } from "@/server/actions/create-agency/schema";
import { deleteAgency } from "@/server/actions/delete-agency";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Agency } from "@prisma/client";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { toast } from "sonner";
import { type z } from "zod";

type AdminRegistrationFormProps = {
  data?: Partial<Agency>;
};

const AdminRegistrationForm: React.FC<AdminRegistrationFormProps> = ({
  data,
}) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof CreateAdmin>>({
    resolver: zodResolver(CreateAdmin),
    defaultValues: {
      name: data?.name ?? "",
      companyEmail: data?.companyEmail ?? "",
      companyPhone: data?.companyPhone ?? "",
      whiteLabel: data?.whiteLabel ?? false,
      address: data?.address ?? "",
      city: data?.city ?? "",
      zipCode: data?.zipCode ?? "",
      state: data?.state ?? "",
      country: data?.country ?? "Canada",
      agencyLogo: data?.agencyLogo ?? "",
    },
  });

  const { execute: executeCreateAdmin, isLoading: createAdminIsLoading } =
    useAction(createAdmin, {
      onSuccess: (data) => {
        toast.success("Agency created");
        if (data?.id) {
          router.refresh();
        }
      },
      onError: (error) => {
        toast.error(error);
      },
    });

  const { execute: executeDeleteAdmin, isLoading: deleteAdminIsLoading } =
    useAction(deleteAgency, {
      onSuccess: (data) => {
        toast.success("Agency deleted successfully");
        if (data) {
          router.refresh();
        }
      },
      onError: (error) => {
        toast.error(error);
      },
    });

  function handleDeleteAgency() {
    if (!data?.id) return;
    void executeDeleteAdmin({ id: data.id });
  }

  function onSubmit(values: z.infer<typeof CreateAdmin>) {
    values.id = data?.id;
    values.customerId = data?.customerId;
    void executeCreateAdmin(values);
  }
  return (
    <AlertDialog>
      <Card overflowHidden={false}>
        <div className="flex w-full flex-col">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-12">
                <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-slate-200 dark:border-slate-700">
                  <div className="col-span-1 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="col-span-full">
                      <h2 className="text-base font-semibold leading-7 text-foreground">
                        Agency Information
                      </h2>
                      <p className="mt-1 text-sm font-normal leading-6 text-muted-foreground">
                        {`Let's create an agency for you business. You can edit agency
                  settings later from the agency settings tab.`}
                      </p>
                    </div>
                    <div className="col-span-full">
                      <FormField
                        control={form.control}
                        name="agencyLogo"
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
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel
                                htmlFor="name"
                                className="block text-sm font-medium leading-6 text-foreground"
                              >
                                Agency name
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
                                Agency Email
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  readOnly
                                  id="companyEmail"
                                  autoComplete="companyEmail"
                                  {...field}
                                  disabled
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

                    <div className="sm:col-span-3">
                      <div className="mt-2">
                        <FormField
                          control={form.control}
                          name="companyPhone"
                          render={({ field }) => {
                            const { onChange, onBlur, value, disabled, name } =
                              field;
                            const properties = {
                              onChange,
                              onBlur,
                              value,
                              disabled,
                              name,
                            };
                            return (
                              <FormItem>
                                <FormLabel
                                  htmlFor="companyPhone"
                                  className="block text-sm font-medium leading-6 text-foreground"
                                >
                                  Phone number
                                </FormLabel>
                                <FormControl>
                                  <PatternFormat
                                    {...properties}
                                    format="+1 (###) ### ####"
                                    allowEmptyFormatting
                                    mask="_"
                                    id="phoneNumber"
                                    type="text"
                                    autoComplete="phone-number"
                                    className={cn(
                                      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:font-semibold placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                                      "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                                      "splash-base-input splash-inputs",
                                    )}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-full">
                      <div className="mt-2">
                        <FormField
                          //   disabled={isLoading}
                          control={form.control}
                          name="whiteLabel"
                          render={({ field }) => {
                            return (
                              <FormItem className="flex flex-row items-center justify-between gap-4 rounded-lg border  border-slate-200 p-4 dark:border-slate-700">
                                <div>
                                  <FormLabel
                                    htmlFor="companyEmail"
                                    className="block text-sm font-medium leading-6 text-foreground"
                                  >
                                    Whitelabel Agency
                                  </FormLabel>
                                  <FormDescription className="font-normal">
                                    Turning on whilelabel mode will show your
                                    agency logo to all sub accounts by default.
                                    You can overwrite this functionality through
                                    sub account settings.
                                  </FormDescription>
                                </div>

                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            );
                          }}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-4">
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

                    <div className="sm:col-span-3">
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
                    <div className="sm:col-span-3">
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
                    <div className="sm:col-span-3">
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

                    <div className="mb-7 sm:col-span-3">
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
                                  disabled
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
                <Button type="submit" disabled={createAdminIsLoading}>
                  {createAdminIsLoading ? (
                    <Loader classNames="h-4 w-4 border-2 border-slate-200/40 animate-[spin_.5s_linear_infinite] brightness-100 saturate-200 border-r-transparent" />
                  ) : (
                    "Save Agency Information"
                  )}
                </Button>
              </div>
            </form>
          </Form>

          {data?.id && (
            <div className="mt-4 flex flex-row items-center justify-between gap-4 rounded-lg border border-destructive p-4">
              <div>
                <div>Danger Zone</div>
              </div>
              <div className="font-normal text-muted-foreground">
                Deleting your agency cannot be undone. This will also delete all
                sub accounts and all data related to your sub accounts. Sub
                accounts will no longer have access to funnels, contacts etc.
              </div>
              <AlertDialogTrigger
                disabled={deleteAdminIsLoading}
                className="hove:bg-red-600 mt-2 whitespace-nowrap rounded-md p-2 text-center font-normal text-red-600 hover:text-white"
              >
                {deleteAdminIsLoading ? "Deleting..." : "Delete Agency"}
              </AlertDialogTrigger>
            </div>
          )}
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-left">
                Are you absolutely sure?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-left">
                This action cannot be undone. This will permanently delete the
                Agency account and all related sub accounts.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex items-center">
              <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={deleteAdminIsLoading}
                className="bg-destructive hover:bg-destructive"
                onClick={handleDeleteAgency}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </div>
      </Card>
    </AlertDialog>
  );
};

export default AdminRegistrationForm;
