"use client";
import {
  useEditor,
  type DeviceTypes,
} from "@/components/providers/editor/EditorProvider";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAction } from "@/hooks/useAction";
import { createFunnelPage } from "@/server/actions/create-funnel-page";
import {
  saveActivityLogsNotification,
  upsertFunnelPage,
} from "@/server/queries";
import { type FunnelPage } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import {
  ArrowLeftCircle,
  EyeIcon,
  Laptop,
  Redo2,
  Smartphone,
  Tablet,
  Undo2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, type FocusEventHandler, useState } from "react";
import { toast } from "sonner";

type Props = {
  funnelId: string;
  funnelPageDetails: FunnelPage;
  subaccountId: string;
  setFunnelPage: React.Dispatch<React.SetStateAction<FunnelPage>>;
};

const FunnelEditorNavigation = ({
  funnelId,
  funnelPageDetails,
  subaccountId,
  setFunnelPage,
}: Props) => {
  const queryClient = useQueryClient();
  const { state, dispatch } = useEditor();
  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  const {
    execute: updateFunnelPageTitle,
    isLoading: upsertingFunnelPageTitle,
  } = useAction(createFunnelPage, {
    onSuccess: (data) => {
      toast("Success", {
        description: `Saved funnel page title: ${data.name}`,
      });
      setFunnelPage(data);
      void queryClient.invalidateQueries({
        queryKey: ["funnelPage", funnelPageDetails.id],
      });
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  useEffect(() => {
    dispatch({
      type: "SET_FUNNELPAGE_ID",
      payload: { funnelPageId: funnelPageDetails.id },
    });
  }, [funnelPageDetails]);

  const handleOnBlurTitleChange: FocusEventHandler<HTMLInputElement> = (
    event,
  ) => {
    if (event.target.value === funnelPageDetails.name) return;
    if (event.target.value) {
      void updateFunnelPageTitle({
        funnelPageId: funnelPageDetails.id,
        name: event.target.value,
        order: funnelPageDetails.order,
        subaccountId,
        funnelId,
      });
    } else {
      toast.error("Opps!", {
        description: "You need to have a title!",
      });
      event.target.value = funnelPageDetails.name;
    }
  };

  const handlePreviewClick = () => {
    dispatch({ type: "TOGGLE_PREVIEW_MODE" });
    dispatch({ type: "TOGGLE_LIVE_MODE" });
  };

  const handleUndo = () => {
    dispatch({ type: "UNDO" });
  };

  const handleRedo = () => {
    dispatch({ type: "REDO" });
  };

  const handleOnSave = async () => {
    setSaveLoading(true);
    const content = JSON.stringify(state.editor.elements);
    try {
      const response = await upsertFunnelPage(
        subaccountId,
        {
          ...funnelPageDetails,
          content,
        },
        funnelId,
      );
      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Updated a funnel page | ${response?.name}`,
        subaccountId: subaccountId,
      });
      if (response) {
        toast.success("Success", {
          description: `Updated a funnel page | ${response?.name}`,
        });
      }
      setSaveLoading(false);
    } catch (error) {
      toast.error("Oppse!", {
        description: "Could not save editor",
      });
      setSaveLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <nav
        className={clsx(
          "splash-border-color flex items-center justify-between gap-2 border-b-[1px] bg-card p-6 transition-all",
          { "!h-0 !overflow-hidden !p-0": state.editor.previewMode },
        )}
      >
        <aside className="flex w-[300px] max-w-[260px] items-center gap-4">
          <Link href={`/subaccount/${subaccountId}/funnels/${funnelId}`}>
            <ArrowLeftCircle />
          </Link>
          <div className="flex w-full flex-col ">
            {upsertingFunnelPageTitle ? (
              <Loader classNames="h-4 w-4 border-2 border-slate-400/80 dark:border-slate-500/80 animate-[spin_.5s_linear_infinite] brightness-100 saturate-200 !border-r-transparent" />
            ) : (
              <Input
                defaultValue={funnelPageDetails.name}
                className="m-0 h-5 border-none bg-card p-0 text-lg"
                onBlur={handleOnBlurTitleChange}
              />
            )}

            <span className="text-sm text-muted-foreground">
              Path: /{funnelPageDetails.pathName}
            </span>
          </div>
        </aside>
        <aside>
          <Tabs
            defaultValue="Desktop"
            className="w-fit "
            value={state.editor.device}
            onValueChange={(value) => {
              dispatch({
                type: "CHANGE_DEVICE",
                payload: { device: value as DeviceTypes },
              });
            }}
          >
            <TabsList className="grid h-fit w-full grid-cols-3 bg-transparent">
              <Tooltip>
                <TooltipTrigger>
                  <TabsTrigger
                    value="Desktop"
                    className="h-10 w-10 p-1.5 data-[state=active]:bg-muted-foreground/5"
                    asChild
                  >
                    <Laptop />
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Desktop</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <TabsTrigger
                    value="Tablet"
                    className="h-10 w-10 p-1.5 data-[state=active]:bg-muted-foreground/5"
                    asChild
                  >
                    <Tablet />
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Tablet</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <TabsTrigger
                    value="Mobile"
                    className="h-10 w-10 p-1.5 data-[state=active]:bg-muted-foreground/5"
                    asChild
                  >
                    <Smartphone />
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Mobile</p>
                </TooltipContent>
              </Tooltip>
            </TabsList>
          </Tabs>
        </aside>
        <aside className="flex items-center gap-2">
          <Button
            variant={"ghost"}
            size={"icon"}
            className="hover:bg-muted-foreground/5"
            onClick={handlePreviewClick}
          >
            <EyeIcon />
          </Button>
          <Button
            disabled={!(state.history.currentIndex > 0)}
            onClick={handleUndo}
            variant={"ghost"}
            size={"icon"}
            className="hover:bg-muted-foreground/5"
          >
            <Undo2 />
          </Button>
          <Button
            disabled={
              !(state.history.currentIndex < state.history.history.length - 1)
            }
            onClick={handleRedo}
            variant={"ghost"}
            size={"icon"}
            className="mr-4 hover:bg-muted-foreground/5"
          >
            <Redo2 />
          </Button>
          <div className="item-center mr-4 flex flex-col">
            <div className="flex flex-row items-center gap-4">
              Draft
              <Switch disabled defaultChecked={true} />
              Publish
            </div>
            <span className="text-sm text-muted-foreground">
              Last updated {funnelPageDetails.updatedAt.toLocaleDateString()}
            </span>
          </div>
          <Button onClick={handleOnSave}>
            {saveLoading ? (
              <Loader classNames="h-4 w-4 border-2 border-white/80 animate-[spin_.5s_linear_infinite] brightness-100 saturate-200 !border-r-transparent" />
            ) : (
              "Save"
            )}
          </Button>
        </aside>
      </nav>
    </TooltipProvider>
  );
};

export default FunnelEditorNavigation;
