"use client";
import Loader from "@/components/shared/Loader";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAction } from "@/hooks/useAction";
import { deleteSubaccount } from "@/server/actions/delete-subaccount";
import { DeleteSubaccount } from "@/server/actions/delete-subaccount/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { memo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";

type Props = {
  dialogOpen: (open: boolean) => void;
  subaccountId: string;
};

const DeleteSubAccountButton = ({ subaccountId, dialogOpen }: Props) => {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof DeleteSubaccount>>({
    resolver: zodResolver(DeleteSubaccount),
    defaultValues: {
      subaccountId,
    },
  });
  const { execute: executeDeleteSubaccount, isLoading: deletingSubaccount } =
    useAction(deleteSubaccount, {
      onSuccess: (data) => {
        toast.success(`${data?.name} has been deleted.`);
      },
      onError: (error) => {
        toast.error(error);
      },
      onComplete: () => {
        dialogOpen(false);
        void queryClient.invalidateQueries({
          queryKey: ["getAuthUserDetails"],
        });
      },
    });
  function onSubmit(values: z.infer<typeof DeleteSubaccount>) {
    void executeDeleteSubaccount(values);
  }

  return (
    <Form {...form}>
      <form>
        <FormField
          control={form.control}
          name="subaccountId"
          render={({ field }) => (
            <Input
              type="text"
              id="subaccountId"
              {...field}
              className="hidden"
            />
          )}
        />
        <div onClick={form.handleSubmit(onSubmit)}>
          {deletingSubaccount ? (
            <Loader classNames="h-4 w-4 border-2 border-slate-200/40 animate-[spin_.5s_linear_infinite] brightness-100 saturate-200 border-r-transparent" />
          ) : (
            "Delete Sub Account"
          )}
        </div>
      </form>
    </Form>
  );
};

export default memo(DeleteSubAccountButton);
