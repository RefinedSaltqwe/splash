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
import { EmailVerificationSchema } from "@/lib/validator";
import { getEmail } from "@/server/actions/get-email";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { memo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";

type VerificationProps = {
  setCurrentTab: (number: string) => void;
  setStepsStatus: (id: string, status: string) => void;
  getVerifiedEmail: (email: string) => void;
};

const Verification: React.FC<VerificationProps> = ({
  setCurrentTab,
  setStepsStatus,
  getVerifiedEmail,
}) => {
  const router = useRouter();

  const { execute, isLoading } = useAction(getEmail, {
    onSuccess: (data) => {
      if (data?.registered) {
        toast.error("Account has already been registered.", {
          description:
            "Contact admin if you are the owner and did not register this account.",
        });
      } else if (data?.email !== "notexist" && data?.registered === false) {
        getVerifiedEmail(data.email);
        setStepsStatus("01", "complete");
        setStepsStatus("02", "current");
        setCurrentTab("02");
        toast.success("Email verified");
      } else if (data?.email === "notexist") {
        toast.error("Email is not verified", {
          description: "This email does not exist in our servers.",
        });
      }
    },
    onError: (error) => {
      toast.error(error, {
        duration: 5000,
      });
    },
  });

  const emailVerification = useForm<z.infer<typeof EmailVerificationSchema>>({
    resolver: zodResolver(EmailVerificationSchema),
    defaultValues: { email: "" },
  });

  function onSubmitEmailVerify(
    values: z.infer<typeof EmailVerificationSchema>,
  ) {
    void execute({
      email: values.email,
    });
    emailVerification.reset();
  }

  return (
    <Form {...emailVerification}>
      <form
        onSubmit={emailVerification.handleSubmit(onSubmitEmailVerify)}
        className="w-full"
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-slate-200 px-6 py-10 pb-12 md:grid-cols-3 dark:border-slate-700">
          <div>
            <h2 className="text-base font-semibold leading-7 text-foreground">
              Verification
            </h2>
            <p className="mt-1 text-sm font-normal leading-6 text-muted-foreground">
              Enter the email you have provided.
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-3">
              <FormField
                control={emailVerification.control}
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
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-4">
          <Button type="button" variant={"ghost"} onClick={() => router.back()}>
            Back
          </Button>
          <Button type="submit" variant={"default"}>
            {isLoading ? (
              <Loader classNames="h-4 w-4 border-2 border-slate-400/80 dark:border-slate-500/80 animate-[spin_.5s_linear_infinite] brightness-100 saturate-200 !border-r-transparent" />
            ) : (
              "Verify"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default memo(Verification);
