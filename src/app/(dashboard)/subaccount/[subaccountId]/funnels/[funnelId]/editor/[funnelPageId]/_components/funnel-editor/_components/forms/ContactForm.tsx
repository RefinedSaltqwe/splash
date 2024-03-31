import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import { UpsertContact } from "@/server/actions/upsert-contact/schema";

type ContactFormProps = {
  title: string;
  subTitle: string;
  apiCall: (values: z.infer<typeof UpsertContact>) => unknown;
  isLoading: boolean;
};

const ContactForm = ({
  apiCall,
  subTitle,
  title,
  isLoading,
}: ContactFormProps) => {
  const form = useForm<z.infer<typeof UpsertContact>>({
    mode: "onChange",
    resolver: zodResolver(UpsertContact),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  //CHALLENGE: We want to create tags for each leads that comes from the form

  return (
    <Card className="w-[500px] max-w-[500px]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subTitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(apiCall)}
            className="flex flex-col gap-4"
          >
            <FormField
              disabled={isLoading}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="mt-4" disabled={isLoading} type="submit">
              {form.formState.isSubmitting ? (
                <Loader classNames="h-4 w-4 border-2 border-slate-400/80 dark:border-slate-500/80 animate-[spin_.5s_linear_infinite] brightness-100 saturate-200 !border-r-transparent" />
              ) : (
                "Get a free quote!"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
