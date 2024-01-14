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
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { invoiceFormValidator } from "@/lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { type z } from "zod";

const CreateForm: React.FC = () => {
  const form = useForm<z.infer<typeof invoiceFormValidator>>({
    resolver: zodResolver(invoiceFormValidator),
    // defaultValues: initialValues,
  });
  function onSubmit(values: z.infer<typeof invoiceFormValidator>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  return (
    <section className="flex w-full flex-col space-y-10">
      <Form {...form}>
        <form className="w-full">
          {/* First Section */}
          <div
            className={cn(
              "flex w-full flex-col space-y-6",
              "lg:flex-row lg:space-x-6 lg:space-y-0",
            )}
          >
            {/* Left Content */}
            <div className="flex flex-1 flex-row">
              <div className="flex flex-1 flex-col space-y-3">
                <span className="text-base text-muted-foreground">From:</span>
                <div className="flex w-full flex-col space-y-2 text-start font-normal text-foreground">
                  <span>Jayvion Simon</span>
                  <span>
                    19034 Verna Unions Apt. 164 - Honolulu, RI / 87535
                  </span>
                  <span>639 999 9934</span>
                </div>
              </div>
              <div className="flex flex-row items-start">
                <Button
                  size={"icon"}
                  variant={"ghost"}
                  className="rounded-full"
                >
                  <Pencil className="text-muted-foreground" size={20} />
                </Button>
              </div>
            </div>
            <Separator
              role="separator"
              orientation="vertical"
              className="hidden lg:flex"
            />
            <Separator role="separator" className="flex lg:hidden" />
            {/* Right Content */}
            <div className="flex flex-1 flex-row">
              <div className="flex flex-1 flex-col space-y-3">
                <span className="text-base text-muted-foreground">From:</span>
                <div className="flex w-full flex-col space-y-2 text-start font-normal text-foreground">
                  <span>Jayvion Simon</span>
                  <span>
                    19034 Verna Unions Apt. 164 - Honolulu, RI / 87535
                  </span>
                  <span>639 999 9934</span>
                </div>
              </div>
              <div className="flex h-full items-start">
                <Button
                  size={"icon"}
                  variant={"ghost"}
                  className="rounded-full"
                >
                  <Pencil className="text-muted-foreground" size={20} />
                </Button>
              </div>
            </div>
          </div>
          <div className="my-3 flex w-full flex-row rounded-lg bg-muted-foreground/5 px-5 py-3">
            <FormField
              // control={form.control}
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
        </form>
      </Form>
    </section>
  );
};
export default CreateForm;
