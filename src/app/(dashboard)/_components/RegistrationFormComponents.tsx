"use client";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { confirmationEmail } from "@/lib/confirmationEmail";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { memo, useCallback, useState } from "react";
import { toast } from "sonner";
import RegistrationForm from "./auth/RegistrationForm";
import Verification from "./auth/Verification";

type RegistrationFormComponentsProps = {
  setCurrentTab: (number: string) => void;
  setStepsStatus: (id: string, status: string) => void;
  current: string;
};

const RegistrationFormComponents: React.FC<RegistrationFormComponentsProps> = ({
  current,
  setCurrentTab,
  setStepsStatus,
}) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const getVerifiedEmail = useCallback(
    (email: string) => {
      setEmail(email);
    },
    [email],
  );

  const { mutateAsync } = useMutation({
    mutationFn: confirmationEmail,
    mutationKey: ["send-confirmation-link"],
  });

  if (current == "01") {
    return (
      <Verification
        setCurrentTab={setCurrentTab}
        setStepsStatus={setStepsStatus}
        getVerifiedEmail={getVerifiedEmail}
      />
    );
  } else if (current == "02") {
    return (
      <RegistrationForm
        email={email}
        setCurrentTab={setCurrentTab}
        setStepsStatus={setStepsStatus}
      />
    );
  } else {
    return (
      <div className="flex h-[300px] w-full flex-col items-center justify-center">
        <Button
          onClick={async () => {
            if (sent) {
              router.push("admin/auth");
            } else {
              try {
                setLoading(true);
                await mutateAsync(email);
                setStepsStatus("03", "complete");
                toast.success("Confirmation link sent to your email.");
                setLoading(false);
                setSent(true);
              } catch (error) {}
            }
          }}
        >
          {loading ? (
            <Loader classNames="h-4 w-4 border-2 border-slate-400/80 dark:border-slate-500/80 animate-[spin_.5s_linear_infinite] brightness-100 saturate-200 !border-r-transparent" />
          ) : sent ? (
            "Log in"
          ) : (
            "Send Confirmation Link"
          )}
        </Button>
      </div>
    );
  }
};
export default memo(RegistrationFormComponents);
