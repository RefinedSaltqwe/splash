"use client";
import GlobalModal from "@/components/drawer/GlobalModal";
import Heading from "@/components/shared/Heading";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/useAction";
import { deletePipeline } from "@/server/actions/delete-pipeline";
import { usePipelineStore } from "@/stores/usePipelineStore";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import CreatePipelineForm from "./form/CreatePipeline";

const PipelineSettings = ({
  pipelineId,
  subaccountId,
}: {
  pipelineId: string;
  subaccountId: string;
}) => {
  const currentPipelines = usePipelineStore((state) => state.currentPipelines);
  const setPipelines = usePipelineStore((state) => state.setPipelines);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const { execute: executeDeletePipeline, isLoading: deletingPipeline } =
    useAction(deletePipeline, {
      onSuccess: (data) => {
        if (data) {
          setPipelines([
            ...currentPipelines.filter(
              (pipeline) => pipeline.id !== pipelineId,
            ),
          ]);
          toast.success("Deleted", {
            description: "Pipeline has been deleted.",
          });
          void queryClient.invalidateQueries({
            queryKey: ["pipelines", subaccountId],
          });
        }
      },
      onError: (error) => {
        toast.error(error);
      },
      onComplete: () => {
        setIsOpen(false);
        router.replace(`/subaccount/${subaccountId}/pipelines`);
      },
    });

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={"Settings"} subTitle="Pipeline settings" />
        <Button variant={"destructive"} onClick={() => setIsOpen(true)}>
          Delete Pipeline
        </Button>
      </div>

      <CreatePipelineForm
        subAccountId={subaccountId}
        defaultData={currentPipelines.find((p) => p.id === pipelineId)}
      />
      <GlobalModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title={`Are you sure you want to delete this pipeline?`}
        description="TThis action cannot be undone. This will permanently delete your data from our servers."
      >
        <div className="flex w-full flex-col justify-end gap-3 md:flex-row">
          <Button
            type="button"
            className="w-full"
            variant={"just_outline"}
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="w-full"
            variant={"destructive"}
            onClick={() =>
              void executeDeletePipeline({ pipelineId, subaccountId })
            }
          >
            <span className="sr-only">Delete</span>
            {deletingPipeline ? (
              <Loader classNames="h-4 w-4 border-2 border-white/80 animate-[spin_.5s_linear_infinite] brightness-100 saturate-200 !border-r-transparent" />
            ) : (
              "Delete"
            )}
          </Button>
        </div>
      </GlobalModal>
    </>
  );
};

export default PipelineSettings;
