"use client";
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
import { eventDefaultValues } from "@/constants";
import { cn } from "@/lib/utils";
import { sampleFormValidator } from "@/lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { type z } from "zod";

type UpdateFormProps = {
  uid: string;
};

const UpdateForm: React.FC<UpdateFormProps> = ({ uid }) => {
  const initialValues = eventDefaultValues;
  const router = useRouter();
  const form = useForm<z.infer<typeof sampleFormValidator>>({
    resolver: zodResolver(sampleFormValidator),
    defaultValues: initialValues,
  });
  function onSubmit(values: z.infer<typeof sampleFormValidator>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-slate-200 px-6 py-10 pb-12 md:grid-cols-3 dark:border-slate-700">
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
                name="firstname"
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
                name="lastname"
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
                        disabled
                        type="text"
                        id="country"
                        autoComplete="country"
                        value={"Canada"}
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
                name="province"
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
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <Button
            type="button"
            variant={"ghost"}
            onClick={() => router.push("/admin/employees/list")}
          >
            Cancel
          </Button>
          <Button type="submit" variant={"default"}>
            Create
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default UpdateForm;
