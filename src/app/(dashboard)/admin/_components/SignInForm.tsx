"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authFormDefaultValues } from "@/constants";
import { authValidatorSchema } from "@/lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import React from "react";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import AuthHeader from "../../_components/AuthHeader";
import { toast } from "@/components/ui/use-toast";
import { signIn } from "next-auth/react";

type SignInFormProps = object;

const SignInForm: React.FC<SignInFormProps> = ({}) => {
  const initialValues = authFormDefaultValues;
  const form = useForm<z.infer<typeof authValidatorSchema>>({
    resolver: zodResolver(authValidatorSchema),
    defaultValues: initialValues,
  });

  async function onSubmit(values: z.infer<typeof authValidatorSchema>) {
    const signInResult = await signIn("email", {
      email: values.email,
      callbackUrl: `/admin/dashboard`,
      redirect: false,
    });

    if (!signInResult?.ok) {
      console.log("Failed");
      return toast({
        title: "Well this did not work...",
        description: "Something went wrong, please try again",
        variant: "destructive",
      });
    } else {
      form.reset();
      return toast({
        title: "Check your email",
        description: "A magic link has been sent to you",
      });
    }
  }

  return (
    <div className="flex min-h-full flex-1 bg-background">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <AuthHeader role="admin" />
          <div className="mt-10">
            <div className="h-full">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-5"
                >
                  <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <Input
                              placeholder="Email"
                              {...field}
                              className="input-field bg-background text-muted-foreground"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={form.formState.isSubmitting}
                    className="button col-span-2 w-full"
                  >
                    {form.formState.isSubmitting ? "Signing in..." : `Sign In`}
                  </Button>
                </form>
              </Form>
            </div>

            <div className="mt-10">
              <div className="relative">
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm font-medium leading-6">
                  <span className="bg-background px-6 text-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    signIn("google", {
                      callbackUrl: `/admin/dashboard`,
                    })
                  }
                >
                  <Image
                    src="/assets/icons/google.png"
                    width={20}
                    height={20}
                    alt="Google Authentication"
                  />
                  <span className="ml-2 text-sm font-semibold leading-6 text-muted-foreground">
                    Google
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Right Content */}
      <div className="relative hidden w-0 flex-1 lg:block">
        <Image
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
          alt=""
          width={500}
          height={500}
          priority
        />
      </div>
    </div>
  );
};
export default SignInForm;
