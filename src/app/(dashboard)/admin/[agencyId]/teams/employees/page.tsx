"use client";
import Card from "@/app/(dashboard)/_components/containers/Card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { eventDefaultValues } from "@/constants";
import { cn } from "@/lib/utils";
import { sampleFormValidator } from "@/lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image, UserCircleIcon } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { type z } from "zod";

type EmployeesProps = object;

const Employees: React.FC<EmployeesProps> = () => {
  const initialValues = eventDefaultValues;
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
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-12">
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-slate-200 px-6 py-10 pb-12 md:grid-cols-3 dark:border-slate-700">
              <div>
                <h2 className="text-base font-semibold leading-7 text-foreground">
                  Profile
                </h2>
                <p className="mt-1 text-sm font-normal leading-6 text-muted-foreground">
                  This information will be displayed publicly so be careful what
                  you share.
                </p>
              </div>

              <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                <div className="sm:col-span-4">
                  <div className="mt-2">
                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel
                            htmlFor="website"
                            className="block text-sm font-medium leading-6 text-foreground"
                          >
                            Website
                          </FormLabel>
                          <FormControl>
                            <div
                              className={cn(
                                "flex rounded-md py-0.5 shadow-sm ring-offset-card sm:max-w-md",
                                "splash-inputs-within splash-base-input",
                              )}
                            >
                              <span className="flex select-none items-center pl-3 font-bold text-gray-500 sm:text-sm">
                                https://
                              </span>
                              <Input
                                type="text"
                                id="website"
                                {...field}
                                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 font-normal text-foreground placeholder:text-gray-400 focus:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 sm:text-sm sm:leading-6 dark:placeholder:text-gray-600"
                                placeholder="www.example.com"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="col-span-full">
                  <div className="mt-2">
                    <FormField
                      control={form.control}
                      name="about"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel
                            htmlFor="about"
                            className="block text-sm font-medium leading-6 text-foreground"
                          >
                            About
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              id="about"
                              rows={3}
                              placeholder="The story of my life..."
                              {...field}
                              className={cn(
                                "block w-full rounded-md shadow-sm ring-offset-card placeholder:text-gray-400 focus:ring-2 sm:text-sm sm:leading-6 dark:placeholder:text-gray-600",
                                "splash-base-input splash-inputs",
                              )}
                            />
                          </FormControl>
                          <FormDescription className="mt-3 text-sm font-normal leading-6 text-muted-foreground">
                            Write a few sentences about yourself.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="photo"
                    className="block text-sm font-medium leading-6 text-foreground"
                  >
                    Photo
                  </label>
                  <div className="mt-2 flex items-center gap-x-3">
                    <UserCircleIcon
                      className="h-12 w-12 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <Button type="button" variant={"card_outline"}>
                      Change
                    </Button>
                  </div>
                </div>

                <div className="col-span-full">
                  <FormField
                    control={form.control}
                    name="coverPhoto"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          htmlFor="coverPhoto"
                          className="block text-sm font-medium leading-6 text-foreground"
                        >
                          Cover photo
                        </FormLabel>
                        <FormControl>
                          <div className="mt-2 flex justify-center rounded-lg border border-dashed border-slate-200 px-6 py-10 dark:border-slate-700">
                            <div className="text-center">
                              <Image
                                className="mx-auto h-12 w-12 text-muted-foreground"
                                aria-hidden="true"
                              />
                              <div className="mt-4 flex text-sm leading-6 text-muted-foreground">
                                <label className="relative cursor-pointer rounded-md bg-transparent font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                                  <span>Upload a file</span>
                                  <Input
                                    id="coverPhoto"
                                    type="file"
                                    className="sr-only"
                                    {...field}
                                  />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                              </div>
                              <p className="text-xs leading-5 text-gray-600">
                                PNG, JPG, GIF up to 10MB
                              </p>
                            </div>
                          </div>
                        </FormControl>
                        <FormDescription className="mt-3 text-sm font-normal leading-6 text-muted-foreground">
                          Write a few sentences about yourself.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

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

                <div className="sm:col-span-4">
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
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger
                              id="country"
                              {...field}
                              className={cn(
                                "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                                "splash-base-input splash-inputs",
                              )}
                              aria-placeholder="Country"
                            >
                              <SelectValue placeholder="Select Country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent
                            className={cn(
                              "border-[1px] border-slate-200 bg-card font-normal placeholder:text-gray-400 dark:border-slate-700 dark:placeholder:text-gray-600",
                            )}
                          >
                            <SelectGroup>
                              <SelectLabel>North America</SelectLabel>
                              <SelectItem
                                value="est"
                                className="hover:!bg-muted-foreground/5"
                              >
                                Eastern Standard Time (EST)
                              </SelectItem>
                              <SelectItem
                                value="cst"
                                className="hover:!bg-muted-foreground/5"
                              >
                                Central Standard Time (CST)
                              </SelectItem>
                              <SelectItem
                                value="mst"
                                className="hover:!bg-muted-foreground/5"
                              >
                                Mountain Standard Time (MST)
                              </SelectItem>
                              <SelectItem
                                value="pst"
                                className="hover:!bg-muted-foreground/5"
                              >
                                Pacific Standard Time (PST)
                              </SelectItem>
                              <SelectItem
                                value="akst"
                                className="hover:!bg-muted-foreground/5"
                              >
                                Alaska Standard Time (AKST)
                              </SelectItem>
                              <SelectItem
                                value="hst"
                                className="hover:!bg-muted-foreground/5"
                              >
                                Hawaii Standard Time (HST)
                              </SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                              <SelectLabel>Europe & Africa</SelectLabel>
                              <SelectItem
                                value="gmt"
                                className="hover:!bg-muted-foreground/5"
                              >
                                Greenwich Mean Time (GMT)
                              </SelectItem>
                              <SelectItem
                                value="cet"
                                className="hover:!bg-muted-foreground/5"
                              >
                                Central European Time (CET)
                              </SelectItem>
                              <SelectItem
                                value="eet"
                                className="hover:!bg-muted-foreground/5"
                              >
                                Eastern European Time (EET)
                              </SelectItem>
                              <SelectItem
                                value="west"
                                className="hover:!bg-muted-foreground/5"
                              >
                                Western European Summer Time (WEST)
                              </SelectItem>
                              <SelectItem
                                value="cat"
                                className="hover:!bg-muted-foreground/5"
                              >
                                Central Africa Time (CAT)
                              </SelectItem>
                              <SelectItem
                                value="eat"
                                className="hover:!bg-muted-foreground/5"
                              >
                                East Africa Time (EAT)
                              </SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                              <SelectLabel>Asia</SelectLabel>
                              <SelectItem
                                value="msk"
                                className="hover:!bg-muted-foreground/5"
                              >
                                Moscow Time (MSK)
                              </SelectItem>
                              <SelectItem
                                value="ist"
                                className="hover:!bg-muted-foreground/5"
                              >
                                India Standard Time (IST)
                              </SelectItem>
                              <SelectItem value="cst_china">
                                China Standard Time (CST)
                              </SelectItem>
                              <SelectItem
                                value="jst"
                                className="hover:!bg-muted-foreground/5"
                              >
                                Japan Standard Time (JST)
                              </SelectItem>
                              <SelectItem
                                value="kst"
                                className="hover:!bg-muted-foreground/5"
                              >
                                Korea Standard Time (KST)
                              </SelectItem>
                              <SelectItem value="ist_indonesia">
                                Indonesia Central Standard Time (WITA)
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-full">
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

                <div className="sm:col-span-2 sm:col-start-1">
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

                <div className="sm:col-span-2">
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

                <div className="sm:col-span-2">
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

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-slate-200 px-6 py-10 pb-12 md:grid-cols-3 dark:border-slate-700">
              <div>
                <h2 className="text-base font-semibold leading-7 text-foreground">
                  Notifications
                </h2>
                <p className="mt-1 text-sm font-normal leading-6 text-muted-foreground">
                  We'll always let you know about important changes, but you
                  pick what else you want to hear about.
                </p>
              </div>

              <div className="max-w-2xl space-y-7 md:col-span-2">
                <fieldset>
                  <legend className="text-sm font-semibold leading-6 text-foreground">
                    By Email
                  </legend>
                  <div className="mt-6 space-y-1">
                    <FormField
                      control={form.control}
                      name="comments"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md py-2">
                          <FormControl>
                            <Checkbox
                              className={cn(
                                "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                                "splash-base-input splash-inputs",
                              )}
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Comments</FormLabel>
                            <FormDescription className="text-sm font-normal text-muted-foreground">
                              Get notified when someones posts a comment on a
                              posting.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="candidates"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md py-2">
                          <FormControl>
                            <Checkbox
                              className={cn(
                                "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                                "splash-base-input splash-inputs",
                              )}
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Candidates</FormLabel>
                            <FormDescription className="text-sm font-normal text-muted-foreground">
                              Get notified when a candidate applies for a job.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="offers"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md py-2">
                          <FormControl>
                            <Checkbox
                              className={cn(
                                "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                                "splash-base-input splash-inputs",
                              )}
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Offers</FormLabel>
                            <FormDescription className="text-sm font-normal text-muted-foreground">
                              Get notified when a candidate accepts or rejects
                              an offer.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </fieldset>
                <fieldset>
                  <legend className="text-sm font-semibold leading-6 text-foreground">
                    Push Notifications
                  </legend>
                  <p className="mt-1 text-sm font-normal leading-6 text-muted-foreground">
                    These are delivered via SMS to your mobile phone.
                  </p>
                  <div className="mt-6 space-y-3">
                    <FormField
                      control={form.control}
                      name="pushNotifications"
                      defaultValue="everything"
                      render={({ field }) => (
                        <FormItem className="space-y-6">
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={"everything"}
                              className="flex flex-col space-y-5"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem
                                    value="everything"
                                    className={cn(
                                      "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                                      "splash-inputs border-slate-200",
                                    )}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Everything
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem
                                    value="messageAndEmail"
                                    className={cn(
                                      "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                                      "splash-inputs border-slate-200",
                                    )}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Direct messages and email
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem
                                    value="none"
                                    className={cn(
                                      "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                                      "splash-inputs border-slate-200",
                                    )}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Nothing
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </fieldset>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <Button type="button" variant={"ghost"}>
              Cancel
            </Button>
            <Button type="submit" variant={"default"}>
              Save
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};

export default Employees;
