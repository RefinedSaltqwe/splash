"use client";
import GlobalModal from "@/components/drawer/GlobalModal";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
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
import { useAction } from "@/hooks/useAction";
import { cn } from "@/lib/utils";
import { createFunnelPage } from "@/server/actions/create-funnel-page";
import { CreateFunnelPage } from "@/server/actions/create-funnel-page/schema";
import { getFunnels } from "@/server/actions/fetch";
import {
  deleteFunnelePage,
  saveActivityLogsNotification,
  upsertFunnelPage,
} from "@/server/queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { type FunnelPage } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CopyPlusIcon, Trash2 } from "lucide-react";
import React, {
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";

interface CreateFunnelPageFormProps {
  modal?: boolean;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
  defaultData?: FunnelPage;
  funnelId: string;
  order: number;
  subaccountId: string;
  pagesState: FunnelPage[];
  setClickedPage: Dispatch<SetStateAction<FunnelPage | undefined>>;
  setPagesState: Dispatch<SetStateAction<FunnelPage[]>>;
}

const CreateFunnelPageForm: React.FC<CreateFunnelPageFormProps> = ({
  defaultData,
  funnelId,
  order,
  subaccountId,
  setIsOpen,
  setPagesState,
  setClickedPage,
  pagesState,
  modal = false,
}) => {
  const [isDuplicating, setIsDuplicating] = useState<boolean>(false);
  const [isOpenDeleteFunnel, setIsOpenDeleteFunnel] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { data: funnels } = useQuery({
    queryKey: ["funnels", subaccountId],
    queryFn: () => getFunnels(subaccountId),
  });
  const form = useForm<z.infer<typeof CreateFunnelPage>>({
    resolver: zodResolver(CreateFunnelPage),
    mode: "onChange",
    defaultValues: {
      name: "",
      pathName: "",
    },
  });

  useEffect(() => {
    if (defaultData) {
      form.reset({ name: defaultData.name, pathName: defaultData.pathName });
    }
  }, [defaultData]);

  const {
    mutateAsync: deleteFunnelPageMutation,
    isPending: deletingFunnelPage,
  } = useMutation({
    mutationFn: deleteFunnelePage,
    async onSuccess(data) {
      toast.success("Success", {
        description: "Funnel page deleted.",
      });
      setIsOpenDeleteFunnel(false);
      setPagesState((prev) => [...prev.filter((page) => page.id !== data.id)]);
      setClickedPage(pagesState[pagesState.length - 2]);
      void queryClient.invalidateQueries({
        queryKey: ["funnel", funnelId],
      });
      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Deleted a funnel page | ${data?.name}`,
        subaccountId: subaccountId,
      });
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const { execute: executeCreateFunnelPage, isLoading: creatingFunnelPage } =
    useAction(createFunnelPage, {
      onSuccess: (data) => {
        if (data) {
          toast.success("Success", {
            description: "Saved funnel page details.",
          });
          setPagesState((prev) => {
            let count = 0;
            const newPages = prev.map((page) => {
              if (page.id === data.id) {
                count++;
                return data;
              }
              return page;
            });
            if (count === 0) {
              newPages.push(data);
            }
            return newPages;
          });
          setClickedPage(data);
          void queryClient.invalidateQueries({
            queryKey: ["funnel", funnelId],
          });
        }
      },
      onError: (error) => {
        toast.error(error);
      },
      onComplete: () => {
        if (setIsOpen) setIsOpen(false);
      },
    });

  const onSubmit = async (values: z.infer<typeof CreateFunnelPage>) => {
    if (order !== 0 && !values.pathName)
      return form.setError("pathName", {
        message:
          "Pages other than the first page in the funnel require a path name example 'secondstep'.",
      });

    void executeCreateFunnelPage({
      ...values,
      funnelPageId: defaultData?.id,
      order: defaultData?.order ?? order,
      pathName: values.pathName ?? "",
      subaccountId,
      funnelId,
    });
  };

  return (
    <Card
      className={cn(
        "splash-border-color border-[1px] shadow-none",
        modal && "border-0 bg-transparent ",
      )}
    >
      <CardHeader className={cn(modal && "px-0 pb-6 pt-0")}>
        <CardTitle>Funnel page</CardTitle>
        <CardDescription className="font-normal">
          Funnel pages are flow in the order they are created by default. You
          can move them around to change their order.
        </CardDescription>
      </CardHeader>
      <CardContent className={cn(modal && "px-0 pb-0")}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Name"
                      {...field}
                      className={cn(
                        "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                        "splash-base-input splash-inputs",
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={order === 0}
              control={form.control}
              name="pathName"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Path Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Path for the page"
                      {...field}
                      value={field.value?.toLowerCase()}
                      className={cn(
                        "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                        "splash-base-input splash-inputs",
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex w-full items-center justify-between">
              <Button
                className={cn("w-22 self-end", modal && "w-full")}
                disabled={creatingFunnelPage}
                type="submit"
              >
                {creatingFunnelPage ? (
                  <Loader classNames="h-4 w-4 border-2 border-slate-200/40 animate-[spin_.5s_linear_infinite] brightness-100 saturate-200 border-r-transparent" />
                ) : (
                  "Save Page"
                )}
              </Button>

              <div className="flex flex-row">
                {defaultData?.id && (
                  <Button
                    variant={"ghost"}
                    className="rounded-full hover:bg-muted-foreground/5"
                    size={"icon"}
                    disabled={form.formState.isSubmitting}
                    type="button"
                    onClick={async () => {
                      setIsDuplicating(true);
                      const lastFunnelPage = funnels?.find(
                        (funnel) => funnel.id === funnelId,
                      )?.FunnelPages.length;
                      try {
                        const response = await upsertFunnelPage(
                          subaccountId,
                          {
                            ...defaultData,
                            id: undefined,
                            order: lastFunnelPage ? lastFunnelPage : 0,
                            visits: 0,
                            name: `${defaultData.name} Copy`,
                            pathName: `${defaultData.pathName}copy`,
                            content: defaultData.content,
                          },
                          funnelId,
                        );
                        if (response) {
                          toast.success("Success", {
                            description: "Funnel page duplicated.",
                          });

                          setPagesState((prev) => [...prev, response]);
                          setClickedPage(response);
                          void queryClient.invalidateQueries({
                            queryKey: ["funnel", funnelId],
                          });
                          await saveActivityLogsNotification({
                            agencyId: undefined,
                            description: `Duplicated a funnel page | ${response?.name}`,
                            subaccountId: subaccountId,
                          });
                        }
                        setIsDuplicating(false);
                      } catch (error) {
                        if (error instanceof Error) {
                          toast.error(error.message);
                        }
                        setIsDuplicating(false);
                      }
                    }}
                  >
                    {isDuplicating ? (
                      <Loader classNames="h-4 w-4 border-2 border-slate-200/40 animate-[spin_.5s_linear_infinite] brightness-100 saturate-200 border-r-transparent" />
                    ) : (
                      <CopyPlusIcon size={20} />
                    )}
                  </Button>
                )}
                {defaultData?.id && (
                  <Button
                    variant="ghost"
                    size={"icon"}
                    disabled={deletingFunnelPage}
                    className="rounded-full hover:!bg-destructive/20"
                    type="button"
                    onClick={() => setIsOpenDeleteFunnel(true)}
                  >
                    {deletingFunnelPage ? (
                      <Loader classNames="h-4 w-4 border-2 border-slate-200/40 animate-[spin_.5s_linear_infinite] brightness-100 saturate-200 border-r-transparent" />
                    ) : (
                      <Trash2 className="text-destructive" size={20} />
                    )}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </CardContent>

      <GlobalModal
        isOpen={isOpenDeleteFunnel}
        setIsOpen={setIsOpenDeleteFunnel}
        title="Are you absolutely sure?"
        description="Are you sure you want to delete this funnel page? This action cannot be undone!"
      >
        <div className="flex w-full flex-col justify-end gap-3 md:flex-row">
          <Button
            type="button"
            className="w-full"
            variant={"just_outline"}
            onClick={() => setIsOpenDeleteFunnel(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="w-full"
            variant={"destructive"}
            onClick={async () => {
              try {
                await deleteFunnelPageMutation(defaultData!.id);
              } catch (err: unknown) {
                if (err instanceof Error) {
                  toast.error(err.message);
                }
              }
            }}
          >
            <span className="sr-only">Delete</span>
            {deletingFunnelPage ? (
              <Loader classNames="h-4 w-4 border-2 border-slate-200/40 animate-[spin_.5s_linear_infinite] brightness-100 saturate-200 border-r-transparent" />
            ) : (
              "Delete"
            )}
          </Button>
        </div>
      </GlobalModal>
    </Card>
  );
};

export default CreateFunnelPageForm;
