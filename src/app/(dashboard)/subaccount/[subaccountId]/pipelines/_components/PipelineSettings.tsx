"use client";
import GlobalModal from "@/components/modal/GlobalModal";
import Loader from "@/components/shared/Loader";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/useAction";
import { deletePipeline } from "@/server/actions/delete-pipeline";
import { type Pipeline } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import CreatePipelineForm from "./form/CreatePipeline";

const PipelineSettings = ({
  pipelineId,
  subaccountId,
  pipelines,
}: {
  pipelineId: string;
  subaccountId: string;
  pipelines: Pipeline[];
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const { execute: executeDeletePipeline, isLoading: deletingPipeline } =
    useAction(deletePipeline, {
      onSuccess: (data) => {
        if (data)
          toast.success("Deleted", {
            description: "Pipeline has been deleted.",
          });
        void queryClient.invalidateQueries({
          queryKey: ["pipelines", subaccountId],
        });
      },
    });

  return (
    <AlertDialog>
      <div>
        <div className="mb-4 flex items-center justify-between">
          <Button variant={"destructive"} onClick={() => setIsOpen(true)}>
            Delete Pipeline
          </Button>
        </div>

        <CreatePipelineForm
          subAccountId={subaccountId}
          defaultData={pipelines.find((p) => p.id === pipelineId)}
        />
        <GlobalModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          title="Are you absolutely sure?"
          description="This action cannot be undone. This will permanently delete your
                account and remove your data from our servers."
        >
          <div className="flex w-full justify-end gap-x-4">
            <Button
              type="button"
              variant={"ghost"}
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant={"destructive"}
              onClick={() =>
                void executeDeletePipeline({ pipelineId, subaccountId })
              }
            >
              <span className="sr-only">Delete</span>
              {deletingPipeline ? (
                <Loader classNames="h-4 w-4 border-2 border-slate-200/40 animate-[spin_.5s_linear_infinite] brightness-100 saturate-200 border-r-transparent" />
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </GlobalModal>
      </div>
    </AlertDialog>
  );
};

export default PipelineSettings;
