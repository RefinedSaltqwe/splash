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
import { jobRoles, roles } from "@/constants";
import { useAction } from "@/hooks/useAction";
import { cn } from "@/lib/utils";
import {
  getAgencyByIdWithSubAccounts,
  getUserDetails,
  getUserPermissions,
} from "@/server/actions/fetch";
import { updateEmployee } from "@/server/actions/update-employee";
import { UpdateEmployee } from "@/server/actions/update-employee/schema";
import { useCurrentUserStore } from "@/stores/useCurrentUser";
import { type UserWithPermissionsAndSubAccounts } from "@/types/stripe";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { toast } from "sonner";
import { type z } from "zod";
import Permission from "../../../_components/form/Permission";

type InputFormProps = {
  uid: string;
};

const InputForm: React.FC<InputFormProps> = ({ uid }) => {
  const [subAccountPermissions, setSubAccountsPermissions] = useState<
    UserWithPermissionsAndSubAccounts | null | undefined
  >(null);
  const { data: user } = useQuery({
    queryKey: ["user", uid],
    queryFn: () => getUserDetails(uid),
  });
  const { data: getUserPermissionsQuery } = useQuery({
    queryKey: ["getUserPermissions", uid],
    queryFn: () => getUserPermissions(user ? user.id : ""),
    enabled: !!user,
  });
  const { data: agencyWithSubAccount } = useQuery({
    queryKey: ["agencyWithSubAccount", uid],
    queryFn: () => getAgencyByIdWithSubAccounts(user ? user.agencyId! : ""),
    enabled: !!user,
  });

  const myRole = useCurrentUserStore((state) => state.role);
  const agencyId = useCurrentUserStore((state) => state.agencyId);
  const queryClient = useQueryClient();

  const router = useRouter();

  const form = useForm<z.infer<typeof UpdateEmployee>>({
    resolver: zodResolver(UpdateEmployee),
    defaultValues: {
      id: user?.id,
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      phoneNumber: user?.phoneNumber,
      street: user?.street,
      country: user?.country,
      city: user?.city,
      state: user?.state,
      postalCode: user?.postalCode,
      jobRole: user?.jobRole,
      role: user?.role,
    },
  });
  const { execute, isLoading } = useAction(updateEmployee, {
    onSuccess: (data) => {
      toast.success("User updated successfully.");
      void queryClient.invalidateQueries({
        queryKey: ["user", data.id],
      });
      void queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      router.push(`/admin/${agencyId}/team/list`);
    },
    onError: (error) => {
      toast.error(error);
    },
  });
  function onSubmit(values: z.infer<typeof UpdateEmployee>) {
    void execute({
      ...values,
    });
  }

  useEffect(() => {
    if (!user) return;
    if (!user.Permissions) return;
    setSubAccountsPermissions(getUserPermissionsQuery);
  }, [user, form]);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 px-6 py-10 pb-12 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-foreground">
              Personal Information
            </h2>
            <p className="mt-1 text-sm font-normal leading-6 text-muted-foreground">
              Update employee information.
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-3">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      htmlFor="firstname"
                      className="block text-sm font-medium leading-6 text-foreground"
                    >
                      First name
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        id="firstname"
                        autoComplete="given-name"
                        {...field}
                        className={cn(
                          "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                          "splash-base-input splash-inputs",
                        )}
                        placeholder="John"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="sm:col-span-3">
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      htmlFor="lastname"
                      className="block text-sm font-medium leading-6 text-foreground"
                    >
                      Last name
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        id="lastname"
                        autoComplete="family-name"
                        {...field}
                        className={cn(
                          "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                          "splash-base-input splash-inputs",
                        )}
                        placeholder="Doe"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="sm:col-span-3">
              <FormField
                control={form.control}
                name="jobRole"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      htmlFor="jobRole"
                      className="block text-sm font-medium leading-6 text-foreground"
                    >
                      Job Role
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger
                          id="jobRole"
                          {...field}
                          className={cn(
                            "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                            "splash-base-input splash-inputs",
                          )}
                          aria-placeholder="Job-Role"
                        >
                          <SelectValue placeholder="Select Job Role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent
                        className={cn(
                          "border-[1px] border-slate-200 bg-card font-normal placeholder:text-gray-400 dark:border-slate-700 dark:placeholder:text-gray-600",
                        )}
                      >
                        {jobRoles.map((role) => (
                          <SelectItem
                            key={role}
                            value={role}
                            className="hover:!bg-muted-foreground/5"
                          >
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="sm:col-span-3">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      htmlFor="role"
                      className="block text-sm font-medium leading-6 text-foreground"
                    >
                      Role
                    </FormLabel>
                    <Select
                      disabled={myRole !== "AGENCY_OWNER"}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger
                          id="role"
                          {...field}
                          className={cn(
                            "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                            "splash-base-input splash-inputs",
                          )}
                          aria-placeholder="Role"
                        >
                          <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent
                        className={cn(
                          "border-[1px] border-slate-200 bg-card font-normal placeholder:text-gray-400 dark:border-slate-700 dark:placeholder:text-gray-600",
                        )}
                      >
                        {roles.map((role) => (
                          <SelectItem
                            key={role}
                            value={role}
                            className="hover:!bg-muted-foreground/5"
                          >
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="sm:col-span-3">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => {
                  const { onChange, onBlur, value, disabled, name } = field;
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
                        htmlFor="phoneNumber"
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

            <div className="sm:col-span-3">
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
                        {...field}
                        type="text"
                        id="country"
                        disabled
                        value={"Canada"}
                        autoComplete="country"
                        className={cn(
                          "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                          "splash-base-input splash-inputs",
                        )}
                        placeholder="Canada"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="sm:col-span-3">
              <FormField
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      htmlFor="street"
                      className="block text-sm font-medium leading-6 text-foreground"
                    >
                      Street address
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        id="street"
                        autoComplete="street"
                        {...field}
                        className={cn(
                          "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                          "splash-base-input splash-inputs",
                        )}
                        placeholder="House #, Street address"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="sm:col-span-3">
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
                        placeholder="Toronto"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="sm:col-span-3">
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      htmlFor="province"
                      className="block text-sm font-medium leading-6 text-foreground"
                    >
                      State/Province
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        id="province"
                        autoComplete="province"
                        {...field}
                        className={cn(
                          "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                          "splash-base-input splash-inputs",
                        )}
                        placeholder="Ontario"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="sm:col-span-3">
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      htmlFor="postalCode"
                      className="block text-sm font-medium leading-6 text-foreground"
                    >
                      Postal Code
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        id="postalCode"
                        autoComplete="postal-code"
                        {...field}
                        className={cn(
                          "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                          "splash-base-input splash-inputs",
                        )}
                        placeholder="XXXXXX"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="sm:col-span-full">
              <div className="mt-6 flex items-center justify-end gap-x-4">
                <Button
                  type="button"
                  variant={"ghost"}
                  onClick={() => router.push(`/admin/${agencyId}/team/list`)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant={"default"}>
                  {isLoading ? (
                    <Loader classNames="h-4 w-4 border-2 border-white/80 animate-[spin_.5s_linear_infinite] brightness-100 saturate-200 !border-r-transparent" />
                  ) : (
                    "Save details"
                  )}
                </Button>
              </div>
            </div>

            <div className="sm:col-span-full">
              {myRole === "AGENCY_OWNER" && (
                <Permission
                  userData={user!}
                  type={"agency"}
                  authUserDataQuery={user}
                  subAccountPermissions={subAccountPermissions}
                  subAccounts={agencyWithSubAccount?.SubAccount}
                  page="team"
                />
              )}
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};
export default InputForm;
