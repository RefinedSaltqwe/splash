"use client";
import GlobalModal from "@/components/modal/GlobalModal";
import { Button } from "@/components/ui/button";
import useDragAndDrop from "@/hooks/useDragAndDrop";
import {
  type LaneDetail,
  type PipelineDetailsWithLanesCardsTagsTickets,
  type TicketAndTags,
} from "@/types/stripe";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { Flag, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import PipelineLane from "./PipelineLane";
import LaneForm from "./form/CreateLane";
import { useQuery } from "@tanstack/react-query";
import { getLanesWithTicketAndTags } from "@/server/actions/fetch";

type Props = {
  pipelineId: string;
  subaccountId: string;
  pipelineDetails: PipelineDetailsWithLanesCardsTagsTickets;
};

const PipelineView = ({ pipelineDetails, pipelineId, subaccountId }: Props) => {
  const [allLanes, setAllLanes] = useState<LaneDetail[] | []>([]);
  const { onDragEnd } = useDragAndDrop(allLanes, setAllLanes);
  const ticketsFromAllLanes: TicketAndTags[] = [];

  const { data: lanes } = useQuery({
    queryKey: ["lanes", pipelineId],
    queryFn: () => getLanesWithTicketAndTags(pipelineId),
    staleTime: undefined,
    refetchInterval: undefined,
  });

  useEffect(() => {
    setAllLanes(lanes ?? []);
    lanes?.forEach((item) => {
      item?.Tickets.forEach((i) => {
        ticketsFromAllLanes.push(i);
      });
    });
  }, [lanes]);

  const [allTickets, setAllTickets] = useState(ticketsFromAllLanes);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="use-automation-zoom-in rounded-xl bg-white/60 p-4 dark:bg-background/60">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl">{pipelineDetails?.name}</h1>
            <Button
              className="flex items-center gap-4"
              onClick={() => setIsOpen(true)}
            >
              <Plus size={15} />
              Create Lane
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
                <div className="mb-4 mt-4 flex gap-3">
                  {allLanes.map((lane, index) => (
                    <PipelineLane
                      allTickets={allTickets}
                      setAllTickets={setAllTickets}
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
        title="Create A Lane"
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
