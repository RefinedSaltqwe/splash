"use client";
import GlobalModal from "@/components/drawer/GlobalModal";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { getPipelinesOnly } from "@/server/actions/fetch";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import CreatePipelineForm from "./form/CreatePipeline";
import { usePipelineStore } from "@/stores/usePipelineStore";

type Props = {
  subAccountId: string;
  pipelineId: string;
};

const PipelineInfoBar = ({ pipelineId, subAccountId }: Props) => {
  const { data: pipelines } = useQuery({
    queryKey: ["pipelines", subAccountId],
    queryFn: () => getPipelinesOnly(subAccountId),
  });

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(pipelineId);
  const currentPipelines = usePipelineStore((state) => state.currentPipelines);
  const setPipelines = usePipelineStore((state) => state.setPipelines);

  const handleClickCreatePipeline = () => {
    setIsOpen(true);
  };

  useEffect(() => {
    setPipelines(pipelines ?? []);
  }, [pipelines]);

  return (
    <div>
      <div className="flex items-end gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between text-foreground"
            >
              {value
                ? currentPipelines.find((pipeline) => pipeline.id === value)
                    ?.name
                : "Select a pipeline..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="bg-drop-downmenu w-[200px] p-0"
            role="dialog"
          >
            <Command>
              <CommandEmpty>No pipelines found.</CommandEmpty>
              <CommandGroup>
                {currentPipelines.map((pipeline) => (
                  <Link
                    key={pipeline.id}
                    href={`/subaccount/${subAccountId}/pipelines/${pipeline.id}`}
                  >
                    <CommandItem
                      key={pipeline.id}
                      value={pipeline.id}
                      onSelect={(currentValue) => {
                        setValue(currentValue);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === pipeline.id ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {pipeline.name}
                    </CommandItem>
                  </Link>
                ))}
                <Button
                  variant="default"
                  className="mt-4 flex w-full gap-2"
                  onClick={handleClickCreatePipeline}
                >
                  <Plus size={15} />
                  Create Pipeline
                </Button>
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <GlobalModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Create A Pipeline"
        description="Pipelines allows you to group tickets into lanes and track your business processes all in one place."
      >
        <CreatePipelineForm subAccountId={subAccountId} setIsOpen={setIsOpen} />
      </GlobalModal>
    </div>
  );
};

export default PipelineInfoBar;
