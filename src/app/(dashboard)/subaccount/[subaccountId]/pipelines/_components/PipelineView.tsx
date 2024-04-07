"use client";
import GlobalModal from "@/components/drawer/GlobalModal";
import Heading from "@/components/shared/Heading";
import { Button } from "@/components/ui/button";
import useDragAndDrop from "@/hooks/useDragAndDrop";
import { getLanesWithTicketAndTags } from "@/server/actions/fetch";
import {
  type LaneDetail,
  type PipelineDetailsWithLanesCardsTagsTickets,
} from "@/types/stripe";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useQuery } from "@tanstack/react-query";
import { Flag, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import PipelineLane from "./PipelineLane";
import LaneForm from "./form/UpsertLane";

type Props = {
  pipelineId: string;
  subaccountId: string;
  pipelineDetails: PipelineDetailsWithLanesCardsTagsTickets;
};

const PipelineView = ({ pipelineDetails, pipelineId, subaccountId }: Props) => {
  const [allLanes, setAllLanes] = useState<LaneDetail[] | []>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { onDragEnd } = useDragAndDrop(allLanes, setAllLanes);

  const { data: lanes } = useQuery({
    queryKey: ["lanes", pipelineId],
    queryFn: () => getLanesWithTicketAndTags(pipelineId),
    staleTime: undefined,
    refetchInterval: undefined,
  });

  useEffect(() => {
    setAllLanes(lanes ?? []);
  }, [lanes]);

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="use-automation-zoom-in rounded-xl">
          <div className="flex items-center justify-between">
            <Heading
              title={pipelineDetails?.name ?? ""}
              subTitle="Projects and Tasks"
            />
            <Button
              className="flex items-center gap-4"
              onClick={() => setIsOpen(true)}
            >
              <Plus size={15} />
              Create lane
            </Button>
          </div>
          <Droppable
            droppableId="lanes"
            type="lane"
            direction="horizontal"
            key="lanes"
          >
            {(provided) => (
              <div
                className="item-center flex gap-x-2 overflow-auto"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <div className="mb-4 mt-4 flex gap-4">
                  {allLanes.map((lane, index) => (
                    <PipelineLane
                      setAllLanes={setAllLanes}
                      subaccountId={subaccountId}
                      pipelineId={pipelineId}
                      tickets={lane.Tickets}
                      laneDetails={lane}
                      index={index}
                      key={lane.id}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
          {allLanes.length == 0 && (
            <div className="flex w-full flex-col items-center justify-center">
              <div className="opacity-100">
                <Flag
                  width="100%"
                  height="100%"
                  className="text-muted-foreground"
                />
              </div>
            </div>
          )}
        </div>
      </DragDropContext>
      <GlobalModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Create a lane"
        description="Lanes allow you to group tickets"
      >
        <LaneForm
          setAllLanes={setAllLanes}
          subAccountId={subaccountId}
          pipelineId={pipelineId}
          setIsOpen={setIsOpen}
        />
      </GlobalModal>
    </>
  );
};

export default PipelineView;
