"use client";
import GeneralWrapper from "@/components/shared/GeneralWrapper";
import React, { useCallback, useEffect, useState } from "react";
import Card from "./containers/Card";
import { Lock } from "lucide-react";
import Loader from "@/components/shared/Loader";
import { useRouter, useSearchParams } from "next/navigation";
import { useAction } from "@/hooks/useAction";
import { confirmEmail } from "@/server/actions/confirmationEmail";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type NewVerificationFormProps = object;

const NewVerificationForm: React.FC<NewVerificationFormProps> = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isLoading, setIsloading] = useState(true);
  const router = useRouter();

  const { execute } = useAction(confirmEmail, {
    onSuccess: (data) => {
      console.log(data);
      if (data) {
        toast.success("Email confirmed!", {
          description: "You can now log in.",
        });
      }
      setIsloading(false);
    },
    onError: (error) => {
      toast.error(error, {
        duration: 5000,
      });
    },
  });

  const onSubmit = useCallback(() => {
    void execute({
      token: token ? token : "",
    });
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-full sm:w-auto sm:max-w-[800px]">
        <GeneralWrapper>
          <Card>
            <div className="flex w-full flex-col p-7">
              <div className="flex flex-1 flex-col items-center justify-center gap-4">
                <span className="flex flex-row items-center justify-center gap-2 text-2xl font-bold text-foreground">
                  <Lock />
                  Auth
                </span>
                <span className="font-normal text-muted-foreground">
                  Confirming your verification
                </span>
                {isLoading ? (
                  <Loader />
                ) : (
                  <Button onClick={() => router.push("/admin/auth")}>
                    Log in
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </GeneralWrapper>
      </div>
    </div>
  );
};
export default NewVerificationForm;
