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
import { createEmployee } from "@/server/actions/create-employee";
import { CreateEmployee } from "@/server/actions/create-employee/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { memo } from "react";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { toast } from "sonner";
import { type z } from "zod";

type RegistrationFormProps = {
  setCurrentTab: (number: string) => void;
  setStepsStatus: (id: string, status: string) => void;
  email: string;
};

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  email,
  setCurrentTab,
  setStepsStatus,
}) => {
  const initialValues = {
    firstName: "",
    lastName: "",
    email,
    password: "",
    phoneNumber: "",
    confirmPassword: "",
    country: "Canada",
    street: "",
    city: "",
    state: "",
    postalCode: "",
  };
  const router = useRouter();

  const { execute, isLoading } = useAction(createEmployee, {
    onSuccess: () => {
      setStepsStatus("02", "complete");
      setStepsStatus("03", "current");
      setCurrentTab("03");
      toast.success("Your account has been created.");
    },
    onError(error) {
      console.log(error);
      toast.error("Error creating your account.");
    },
  });
  const form = useForm<z.infer<typeof CreateEmployee>>({
    resolver: zodResolver(CreateEmployee),
    defaultValues: initialValues,
  });
  function onSubmit(values: z.infer<typeof CreateEmployee>) {
    void execute({
      ...values,
    });
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
              Use a permanent address where you can receive mail.
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
                      htmlFor="firstName"
                      className="block text-sm font-medium leading-6 text-foreground"
                    >
                      First name
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        id="firstName"
                        autoComplete="first-name"
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
                        disabled
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      htmlFor="password"
                      className="block text-sm font-medium leading-6 text-foreground"
                    >
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        id="password"
                        autoComplete="password"
                        {...field}
                        className={cn(
                          "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                          "splash-base-input splash-inputs",
                        )}
                        placeholder="Password"
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
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium leading-6 text-foreground"
                    >
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        id="confirmPassword"
                        autoComplete="confirmPassword"
                        {...field}
                        className={cn(
                          "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                          "splash-base-input splash-inputs",
                        )}
                        placeholder="Confirm Password"
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
                        type="text"
                        id="country"
                        autoComplete="country"
                        {...field}
                        disabled
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
                      htmlFor="state"
                      className="block text-sm font-medium leading-6 text-foreground"
                    >
                      State/Province
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
                        placeholder="--- ---"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-4">
          <Button type="button" variant={"ghost"} onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" variant={"default"}>
            {isLoading ? (
              <Loader classNames="h-4 w-4 border-2 border-slate-200/40 animate-[spin_.5s_linear_infinite] brightness-100 saturate-200 border-r-transparent" />
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default memo(RegistrationForm);
