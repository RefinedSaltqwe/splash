"use client";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAction } from "@/hooks/useAction";
import { cn } from "@/lib/utils";
import { getAuthUserDetails, getUserPermissions } from "@/server/actions/fetch";
import { updateUser } from "@/server/actions/update-user";
import { UpdateUser } from "@/server/actions/update-user/schema";
import {
  type AuthUserWithAgencySigebarOptionsSubAccounts,
  type UserWithPermissionsAndSubAccounts,
} from "@/types/stripe";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SubAccount, type User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";
import Permission from "./Permission";

type UserDetailsProps = {
  id: string | null;
  type: "agency" | "subaccount";
  userData?: Partial<User>;
  subAccounts?: SubAccount[];
};

const UserDetails: React.FC<UserDetailsProps> = ({
  id,
  type,
  subAccounts,
  userData,
}) => {
  const [roleState, setRoleState] = useState("");
  const [subAccountPermissions, setSubAccountsPermissions] = useState<
    UserWithPermissionsAndSubAccounts | null | undefined
  >(null);
  const [authUserData, setAuthUserData] =
    useState<AuthUserWithAgencySigebarOptionsSubAccounts | null>(null);

  const { data: authUserDataQuery } = useQuery({
    queryKey: ["getAuthUserDetails"],
    queryFn: () => getAuthUserDetails(),
    enabled: !!userData,
  });
  const { data: getUserPermissionsQuery } = useQuery({
    queryKey: ["getUserPermissions"],
    queryFn: () => getUserPermissions(userData ? userData.id! : ""),
    enabled: !!authUserDataQuery,
  });

  const { execute: executeUpdateUser, isLoading: updatingUser } = useAction(
    updateUser,
    {
      onSuccess: (data) => {
        toast.success(`${data.firstName}'s information has been updated`);
      },
      onError: (error) => {
        toast.error(error);
      },
    },
  );

  const form = useForm<z.infer<typeof UpdateUser>>({
    resolver: zodResolver(UpdateUser),
    defaultValues: {
      id: id ? id : "",
      name: userData ? userData.name : "",
      email: userData ? userData.email : "",
      image: userData ? userData.image : "",
      role: userData!.role,
    },
  });
  function onSubmit(values: z.infer<typeof UpdateUser>) {
    void executeUpdateUser(values);
  }

  useEffect(() => {
    if (userData) {
      if (authUserDataQuery) setAuthUserData(authUserDataQuery);
    }
  }, [authUserDataQuery]);

  useEffect(() => {
    if (!authUserDataQuery) return;
    if (!userData) return;
    setSubAccountsPermissions(getUserPermissionsQuery);
  }, [authUserDataQuery, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-12">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-slate-200 dark:border-slate-700">
            <div className="col-span-1 grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="col-span-full">
                <h2 className="text-base font-semibold leading-7 text-foreground">
                  User Details
                </h2>
                <p className="mt-1 text-sm font-normal leading-6 text-muted-foreground">
                  {`Let's create an agency for you business. You can edit agency
                  settings later from the agency settings tab.`}
                </p>
              </div>
              <div className="col-span-full">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor="image"
                        className="block text-sm font-medium leading-6 text-foreground"
                      >
                        Avatar Photo
                      </FormLabel>
                      <FormControl>
                        <FileUpload
                          apiEndpoint="avatar"
                          onChange={field.onChange}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="sm:col-span-4">
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
                          User full name
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            id="name"
                            className={cn(
                              "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                              "splash-base-input splash-inputs",
                            )}
                            placeholder="Full name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
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
                            readOnly={
                              userData?.role === "AGENCY_OWNER" ||
                              form.formState.isSubmitting
                            }
                            id="userEmail"
                            autoComplete="userEmail"
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
                    disabled={form.formState.isSubmitting}
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel> User Role</FormLabel>
                        <Select
                          disabled={field.value === "AGENCY_OWNER"}
                          onValueChange={(value) => {
                            if (
                              value === "SUBACCOUNT_USER" ||
                              value === "SUBACCOUNT_GUEST"
                            ) {
                              setRoleState(
                                "You need to have subaccounts to assign Subaccount access to team members.",
                              );
                            } else {
                              setRoleState("");
                            }
                            field.onChange(value);
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select user role..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="AGENCY_ADMING">
                              Agency Admin
                            </SelectItem>
                            {userData?.role === "AGENCY_OWNER" && (
                              <SelectItem value="AGENCY_OWNER">
                                Agency Owner
                              </SelectItem>
                            )}
                            <SelectItem value="SUBACCOUNT_USER">
                              Sub Account User
                            </SelectItem>
                            <SelectItem value="SUBACCOUNT_GUEST">
                              Sub Account Guest
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-muted-foreground">{roleState}</p>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {authUserData?.role === "AGENCY_OWNER" && (
          <Permission
            userData={userData}
            type={type}
            authUserDataQuery={authUserDataQuery}
            subAccountPermissions={subAccountPermissions}
            subAccounts={subAccounts}
            page="settings"
          />
        )}
        <div className="mt-6 flex items-center justify-end gap-x-4">
          <Button type="submit" disabled={updatingUser}>
            {updatingUser ? (
              <Loader classNames="h-4 w-4 border-2 border-slate-200/40 animate-[spin_.5s_linear_infinite] brightness-100 saturate-200 border-r-transparent" />
            ) : (
              "Save User Information"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default UserDetails;
