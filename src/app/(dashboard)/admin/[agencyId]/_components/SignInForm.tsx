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
import { authFormDefaultValues } from "@/constants";
import { LoginFormSchema } from "@/lib/validator";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";
// import AuthHeader from "../../_components/AuthHeader";
import { cn } from "@/lib/utils";

type SignInFormProps = object;

const SignInForm: React.FC<SignInFormProps> = ({}) => {
  const [loading, isLoading] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const initialValues = authFormDefaultValues;
  const router = useRouter();

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: initialValues,
  });

  async function onSubmit(values: z.infer<typeof LoginFormSchema>) {
    if (twoFactor && values.code === "") {
      toast.error("Code is required.", {
        description: "Please try again.",
      });
      return;
    }
    const signInResult = await signIn("credentials", {
      email: values.email,
      password: values.password,
      code: values.code,
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
      redirect: false,
    });

    if (!signInResult?.ok) {
      if (signInResult?.error === "AccessDenied") {
        toast.error(`${signInResult?.error}: Email not verified`, {
          description: "Confirmation link sent to email.",
        });
      } else if (signInResult?.error === "two-factor-needed") {
        setTwoFactor(true);
        toast.success("Check your email");
        return;
      } else if (signInResult?.error === "Code has expired!") {
        setTwoFactor(false);
        form.reset();
        toast.error(signInResult?.error, {
          description: "Please try again.",
        });
      } else if (signInResult?.error === "Account does not exist.") {
        toast.error(signInResult?.error, {
          description: "Please try again or use Google Authentication.",
        });
      } else {
        toast.error(signInResult?.error, {
          description: "Please try again.",
        });
      }
    } else {
      isLoading(true);
      router.push(DEFAULT_LOGIN_REDIRECT);
      toast.loading("Redirecting...", {
        description: "Please wait",
      });
    }
  }
  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-background">
        <Loader
          type="spinner"
          classNames="h-6 w-6 border-2 border-primary brightness-100 saturate-200 border-r-transparent"
        />
      </div>
    );
  }
  return (
    <section className="flex min-h-full flex-1 bg-background">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* <AuthHeader role="admin" /> */}
          <div className="mt-10">
            <div className="h-full">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-5"
                >
                  <div className={cn("flex flex-col", !twoFactor && "gap-5")}>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <Input
                              placeholder="Email"
                              {...field}
                              disabled={twoFactor}
                              className={cn(
                                "input-field bg-background text-muted-foreground",
                                twoFactor && "hidden",
                              )}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Password"
                              {...field}
                              disabled={twoFactor}
                              className={cn(
                                "input-field bg-background text-muted-foreground",
                                twoFactor && "hidden",
                              )}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {twoFactor && (
                      <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel
                              htmlFor="2fa"
                              className="block text-sm font-medium leading-6 text-foreground"
                            >
                              Two Factor Authentication
                            </FormLabel>
                            <FormControl>
                              <Input
                                id="2fa"
                                type="text"
                                placeholder="Code"
                                {...field}
                                className="input-field bg-background text-muted-foreground"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={form.formState.isSubmitting}
                    className="button col-span-2 w-full"
                  >
                    {form.formState.isSubmitting ? (
                      <Loader classNames="h-4 w-4 border-2 border-slate-400/80 dark:border-slate-500/80 animate-[spin_.5s_linear_infinite] brightness-100 saturate-200 !border-r-transparent" />
                    ) : twoFactor ? (
                      "Confirm"
                    ) : (
                      `Sign In`
                    )}
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
                      callbackUrl: DEFAULT_LOGIN_REDIRECT,
                    })
                  }
                >
                  <Image
                    src="/assets/icons/google.png"
                    loading="lazy"
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
          alt="background"
          priority
          width={500}
          height={500}
        />
      </div>
    </section>
  );
};
export default SignInForm;
