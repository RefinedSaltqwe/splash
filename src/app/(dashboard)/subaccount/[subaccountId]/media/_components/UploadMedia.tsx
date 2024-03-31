"use client";
import FileUpload from "@/components/shared/FileUpload";
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
import { uploadMedia } from "@/server/actions/upload-media";
import { UploadMedia } from "@/server/actions/upload-media/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { type Dispatch, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";

type UploadMediaFormProps = {
  subaccountId: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

const UploadMediaForm = ({ subaccountId, setIsOpen }: UploadMediaFormProps) => {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof UploadMedia>>({
    resolver: zodResolver(UploadMedia),
    mode: "onSubmit",
    defaultValues: {
      link: "",
      name: "",
      subaccountId,
    },
  });

  const { execute: executeUploadMedia, isLoading: uploadingMedia } = useAction(
    uploadMedia,
    {
      onSuccess: (data) => {
        toast.success(`${data.name} has been ploaded successfully`);
        void queryClient.invalidateQueries({
          queryKey: ["media", subaccountId],
        });
      },
      onError: (error) => {
        toast.error(error);
      },
      onComplete: () => {
        setIsOpen(false);
      },
    },
  );

  async function onSubmit(values: z.infer<typeof UploadMedia>) {
    void executeUploadMedia({
      link: values.link,
      name: values.name,
      subaccountId: subaccountId,
    });
  }

  return (
    <div className="flex w-full flex-col">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex w-full flex-col gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="name"
                    className="block text-sm font-medium leading-6 text-foreground"
                  >
                    Media name
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      id="name"
                      autoComplete="media-name"
                      {...field}
                      className={cn(
                        "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                        "splash-base-input splash-inputs",
                      )}
                      placeholder="Media name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Media File</FormLabel>
                  <FormControl>
                    <FileUpload
                      apiEndpoint="subaccountLogo"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">
              {uploadingMedia ? (
                <Loader classNames="h-4 w-4 border-2 border-slate-400/80 dark:border-slate-500/80 animate-[spin_.5s_linear_infinite] brightness-100 saturate-200 !border-r-transparent" />
              ) : (
                "Upload media"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UploadMediaForm;
