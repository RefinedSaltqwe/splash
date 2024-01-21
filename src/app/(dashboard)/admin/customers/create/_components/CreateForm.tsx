"use client";
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
import { customerDefaultValues } from "@/constants/defaultsValues";
import { useAction } from "@/hooks/useAction";
import { cn, formatDateTime } from "@/lib/utils";
import { createCustomer } from "@/server/actions/create-customer";
import { CreateCustomer } from "@/server/actions/create-customer/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { toast } from "sonner";
import { type z } from "zod";

const CreateForm: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { execute, isLoading } = useAction(createCustomer, {
    onSuccess: (data) => {
      const companyName = data.companyName;
      const custName = companyName !== "N/A" ? companyName : data.name;
      toast.success(`New customer "${custName}" has been created.`, {
        description: formatDateTime(data.createdAt).dateOnly,
        duration: 2000,
      });
      //? Refetch the updated customer data
      void queryClient.invalidateQueries({
        queryKey: ["customers"],
      });
    },
    onError: (error) => {
      toast.error(error, {
        duration: 2000,
      });
    },
    onComplete: () => {
      router.push(`/admin/customers`);
    },
  });

  const form = useForm<z.infer<typeof CreateCustomer>>({
    resolver: zodResolver(CreateCustomer),
    defaultValues: customerDefaultValues,
  });

  function onSubmit(values: z.infer<typeof CreateCustomer>) {
    void execute({
      name: values.name,
      companyName: values.companyName,
      address: values.address,
      email: values.email,
      phoneNumber: values.phoneNumber,
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-slate-200 px-6 py-10 pb-12 md:grid-cols-3 dark:border-slate-700">
          <div>
            <h2 className="text-base font-semibold leading-7 text-foreground">
              Customer Information
            </h2>
            <p className="mt-1 text-sm font-normal leading-6 text-muted-foreground">
              Must be valid address where they can receive mail.
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      htmlFor="name"
                      className="block text-sm font-medium leading-6 text-foreground"
                    >
                      Full name
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        id="name"
                        autoComplete="name"
                        {...field}
                        className={cn(
                          "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                          "splash-base-input splash-inputs",
                        )}
                        placeholder="John Doe"
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
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      htmlFor="companyName"
                      className="block text-sm font-medium leading-6 text-foreground"
                    >
                      Company name{" "}
                      <span className="text-muted-foreground">(Optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        id="companyName"
                        autoComplete="family-name"
                        {...field}
                        className={cn(
                          "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                          "splash-base-input splash-inputs",
                        )}
                        placeholder="Splash, Inc."
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      htmlFor="email"
                      className="block text-sm font-medium leading-6 text-foreground"
                    >
                      Email address
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        id="email"
                        autoComplete="email"
                        {...field}
                        className={cn(
                          "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                          "splash-base-input splash-inputs",
                        )}
                        placeholder="example@gmail.com"
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

            <div className="sm:col-span-full">
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
                        placeholder="House # Street address, City, Province/State, Postal Code, Country"
                      />
                    </FormControl>
                    <FormDescription className="font-normal text-muted-foreground">
                      House # Street address, City, Province/State, Postal Code,
                      Country
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-4">
          <Button
            type="button"
            variant={"card_outline"}
            onClick={() => router.push("/admin/customers")}
          >
            Cancel
          </Button>
          <Button type="submit" variant={"default"} disabled={isLoading}>
            {isLoading ? "Creating..." : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default CreateForm;
