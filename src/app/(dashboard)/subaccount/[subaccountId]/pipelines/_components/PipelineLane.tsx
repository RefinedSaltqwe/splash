/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import GlobalModal from "@/components/drawer/GlobalModal";
import Loader from "@/components/shared/Loader";
import ScrollableElement from "@/components/shared/ScrollableElement";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useAction } from "@/hooks/useAction";
import { cn, formatPrice } from "@/lib/utils";
import { deleteLane } from "@/server/actions/delete-lane";
import { type LaneDetail, type TicketWithTags } from "@/types/stripe";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { useQueryClient } from "@tanstack/react-query";
import { Edit, MoreVertical, PlusCircleIcon, Trash } from "lucide-react";
import React, {
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { toast } from "sonner";
import PipelineTicket from "./PipelineTicket";
import LaneForm from "./form/UpsertLane";
import TicketForm from "./form/UpsertTicket";

interface PipelaneLaneProps {
  setAllLanes: Dispatch<SetStateAction<[] | LaneDetail[]>>;
  tickets: TicketWithTags;
  pipelineId: string;
  laneDetails: LaneDetail;
  subaccountId: string;
  index: number;
}

const PipelineLane: React.FC<PipelaneLaneProps> = ({
  setAllLanes,
  tickets,
  pipelineId,
  laneDetails,
  subaccountId,
  index,
}) => {
  const [isOpenCreateTicketModal, setIsOpenCreateTicketModal] =
    useState<boolean>(false);
  const [isOpenUpdateLaneModal, setIsOpenUpdateLaneModal] =
    useState<boolean>(false);
  const [isOpenDeleteLaneModal, setIsOpenDeleteLaneModal] =
    useState<boolean>(false);
  const [ticketList, setTicketList] = useState<TicketWithTags>([]);

  const queryClient = useQueryClient();

  const laneAmt = useMemo(() => {
    return tickets.reduce(
      (sum, ticket) => sum + (Number(ticket?.value) || 0),
      0,
    );
  }, [tickets]);

  const { execute: executeDeleteLane, isLoading: deletingLane } = useAction(
    deleteLane,
    {
      onSuccess: (data) => {
        if (data) {
          setAllLanes((prev) => [
            ...prev.filter((item) => item.id !== laneDetails.id),
          ]);
          toast.success(`Success`, {
            description: "Lane has been deleted.",
          });
          void queryClient.invalidateQueries({
            queryKey: ["lanes", pipelineId],
          });
        }
      },
      onError: (error) => {
        toast.error(error);
      },
      onComplete: () => {
        setIsOpenDeleteLaneModal(false);
      },
    },
  );

  useEffect(() => {
    setTicketList(tickets);
  }, [tickets]);

  return (
    <Draggable
      draggableId={laneDetails.id.toString()}
      index={index}
      key={laneDetails.id.toString()}
    >
      {(provided, snapshot) => {
        if (snapshot.isDragging) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          const offset = { x: 0, y: 0 };
          //@ts-expect-error
          const x = provided.draggableProps.style?.left - offset.x;
          //@ts-expect-error
          const y = provided.draggableProps.style?.top - offset.y;
          //@ts-expect-error
          provided.draggableProps.style = {
            ...provided.draggableProps.style,
            top: y,
            left: x,
          };
        }
        return (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            className="h-full"
          >
            <DropdownMenu>
              <div className="relative h-auto w-[300px] flex-shrink-0 overflow-visible rounded-lg border-[1px] border-border bg-card/30 pb-1 pl-4 pr-[2px] pt-2 shadow-lg shadow-muted-foreground/10 dark:shadow-none">
                <div
                  {...provided.dragHandleProps}
                  className=" absolute left-0 right-0 top-0 z-10 h-14 bg-slate-200/60 backdrop-blur-lg dark:bg-background/40 "
                >
                  <div className="splash-border-color flex h-full cursor-grab items-center justify-between border-b-[1px] p-4">
                    {/* {laneDetails.order} */}
                    <div className="flex w-full items-center gap-2">
                      <div className={cn("h-4 w-4 rounded-full bg-primary")} />
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <span className="max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap text-sm font-bold">
                            {laneDetails.name}
                          </span>
                        </HoverCardTrigger>
                        <HoverCardContent
                          side="bottom"
                          className="bg-drop-downmenu w-fit"
                        >
                          <span className="text-sm font-bold">
                            {laneDetails.name}
                          </span>
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                      <Badge className="bg-white text-black ">
                        {formatPrice(String(laneAmt))}
                      </Badge>
                      <DropdownMenuTrigger className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-accent hover:text-accent-foreground">
                        <MoreVertical className="cursor-pointer text-muted-foreground" />
                      </DropdownMenuTrigger>
                    </div>
                  </div>
                </div>

                <Droppable
                  droppableId={laneDetails.id.toString()}
                  key={laneDetails.id}
                  type="ticket"
                >
                  {(provided) => (
                    <ScrollableElement
                      className="max-h-[700px] !bg-transparent pt-12"
                      offsetRight="mr-1"
                    >
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="mt-2"
                      >
                        {ticketList.map((ticket, index) => (
                          <PipelineTicket
                            pipelineId={pipelineId}
                            subaccountId={subaccountId}
                            ticket={ticket}
                            key={ticket.id.toString()}
                            index={index}
                            setTicketList={setTicketList}
                          />
                        ))}
                        {provided.placeholder}
                      </div>
                    </ScrollableElement>
                  )}
                </Droppable>

                <DropdownMenuContent className="bg-drop-downmenu" role="dialog">
                  <DropdownMenuLabel>Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="flex items-center gap-2"
                    onClick={() => setIsOpenUpdateLaneModal(true)}
                  >
                    <Edit size={15} />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="splash-red-button flex items-center gap-2"
                    onClick={() => setIsOpenDeleteLaneModal(true)}
                  >
                    <Trash size={15} />
                    Delete
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center gap-2 bg-primary text-white hover:!bg-primary"
                    onClick={() => setIsOpenCreateTicketModal(true)}
                  >
                    <PlusCircleIcon size={15} />
                    Create Ticket
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </div>
            </DropdownMenu>
            <GlobalModal
              isOpen={isOpenDeleteLaneModal}
              setIsOpen={setIsOpenDeleteLaneModal}
              title={`Are you sure you want to delete "${laneDetails.name}"?`}
              description="This action cannot be undone. This will permanently delete your data from our servers."
            >
              <div className="flex w-full flex-col justify-end gap-3 md:flex-row">
                <Button
                  type="button"
                  className="w-full"
                  variant={"just_outline"}
                  onClick={() => setIsOpenDeleteLaneModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="w-full"
                  variant={"destructive"}
                  onClick={() =>
                    void executeDeleteLane({
                      pipelineId,
                      subaccountId,
                      laneId: laneDetails.id,
                    })
                  }
                >
                  <span className="sr-only">Delete</span>
                  {deletingLane ? (
                    <Loader classNames="h-4 w-4 border-2 border-white/80 animate-[spin_.5s_linear_infinite] brightness-100 saturate-200 !border-r-transparent" />
                  ) : (
                    "Delete"
                  )}
                </Button>
              </div>
            </GlobalModal>
            <GlobalModal
              isOpen={isOpenUpdateLaneModal}
              setIsOpen={setIsOpenUpdateLaneModal}
              title="Edit lane details"
            >
              <LaneForm
                pipelineId={pipelineId}
                defaultData={laneDetails}
                setAllLanes={setAllLanes}
                subAccountId={subaccountId}
                setIsOpen={setIsOpenUpdateLaneModal}
              />
            </GlobalModal>
            <GlobalModal
              isOpen={isOpenCreateTicketModal}
              setIsOpen={setIsOpenCreateTicketModal}
              title="Create a ticket"
              description="Tickets are a great way to keep track of tasks"
            >
              <TicketForm
                pipelineId={pipelineId}
                setTicketList={setTicketList}
                setIsOpen={setIsOpenCreateTicketModal}
                laneId={laneDetails.id}
                subaccountId={subaccountId}
              />
            </GlobalModal>
          </div>
        );
      }}
    </Draggable>
  );
};

export default PipelineLane;
