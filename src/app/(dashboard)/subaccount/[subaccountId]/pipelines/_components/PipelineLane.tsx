/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import GlobalModal from "@/components/modal/GlobalModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { type TicketWithTags, type LaneDetail } from "@/types/stripe";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { Edit, MoreVertical, PlusCircleIcon, Trash } from "lucide-react";
import React, {
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
  useEffect,
  lazy,
} from "react";
import PipelineTicket from "./PipelineTicket";
import { ScrollArea } from "@/components/ui/scroll-area";

const TicketForm = lazy(() => import("./form/CreateTicket"));

interface PipelaneLaneProps {
  setAllTickets: Dispatch<SetStateAction<TicketWithTags>>;
  allTickets: TicketWithTags;
  tickets: TicketWithTags;
  pipelineId: string;
  laneDetails: LaneDetail;
  subaccountId: string;
  index: number;
}

const PipelineLane: React.FC<PipelaneLaneProps> = ({
  setAllTickets,
  tickets,
  pipelineId,
  laneDetails,
  subaccountId,
  allTickets,
  index,
}) => {
  const [isOpenCreateTicketModal, setIsOpenCreateTicketModal] =
    useState<boolean>(false);

  const [ticketList, setTicketList] = useState<TicketWithTags>([]);

  const amt = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  });

  const laneAmt = useMemo(() => {
    return tickets.reduce(
      (sum, ticket) => sum + (Number(ticket?.value) || 0),
      0,
    );
  }, [tickets]);

  const randomColor = `#${Math.random().toString(16).slice(2, 8)}`;

  const addNewTicket = (ticket: TicketWithTags[0]) => {
    setAllTickets((prev) => [...prev, ticket]);
  };

  const handleEditLane = () => {
    // setOpen(
    //   <CustomModal title="Edit Lane Details" subheading="">
    //     <CreateLaneForm pipelineId={pipelineId} defaultData={laneDetails} />
    //   </CustomModal>,
    // );
  };

  const handleDeleteLane = async () => {
    try {
      //   const response = await deleteLane(laneDetails.id);
      //   await saveActivityLogsNotification({
      //     agencyId: undefined,
      //     description: `Deleted a lane | ${response?.name}`,
      //     subaccountId,
      //   });
      //   router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

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
          //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //   const offset = { x: 300, y: 0 };
          //   //@ts-expect-error
          //   const x = provided.draggableProps.style?.left - offset.x;
          //   //@ts-expect-error
          //   const y = provided.draggableProps.style?.top - offset.y;
          //   //@ts-expect-error
          //   provided.draggableProps.style = {
          //     ...provided.draggableProps.style,
          //     top: y,
          //     left: x,
          //   };
        }
        return (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            className="h-full"
          >
            <AlertDialog>
              <DropdownMenu>
                <div className="relative h-auto w-[300px] flex-shrink-0 overflow-visible rounded-lg bg-card/30 px-4 pb-1 pt-2 shadow-lg shadow-muted-foreground/10 dark:shadow-none">
                  <div
                    {...provided.dragHandleProps}
                    className=" absolute left-0 right-0 top-0 z-10 h-14 bg-slate-200/60 backdrop-blur-lg dark:bg-background/40 "
                  >
                    <div className="splash-border-color flex h-full cursor-grab items-center justify-between border-b-[1px] p-4">
                      {/* {laneDetails.order} */}
                      <div className="flex w-full items-center gap-2">
                        <div
                          className={cn("h-4 w-4 rounded-full")}
                          style={{ background: randomColor }}
                        />
                        <span className="text-sm font-bold">
                          {laneDetails.name}
                        </span>
                      </div>
                      <div className="flex flex-row items-center">
                        <Badge className="bg-white text-black">
                          {amt.format(laneAmt)}
                        </Badge>
                        <DropdownMenuTrigger>
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
                      <div className="splash-scroll max-h-[700px] pt-12">
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="mt-2"
                        >
                          {ticketList.map((ticket, index) => (
                            <PipelineTicket
                              allTickets={allTickets}
                              setAllTickets={setAllTickets}
                              subaccountId={subaccountId}
                              ticket={ticket}
                              key={ticket.id.toString()}
                              index={index}
                            />
                          ))}
                          {provided.placeholder}
                        </div>
                      </div>
                    )}
                  </Droppable>

                  <DropdownMenuContent>
                    <DropdownMenuLabel>Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <AlertDialogTrigger>
                      <DropdownMenuItem className="flex items-center gap-2">
                        <Trash size={15} />
                        Delete
                      </DropdownMenuItem>
                    </AlertDialogTrigger>

                    <DropdownMenuItem
                      className="flex items-center gap-2"
                      onClick={handleEditLane}
                    >
                      <Edit size={15} />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex items-center gap-2"
                      onClick={() => setIsOpenCreateTicketModal(true)}
                    >
                      <PlusCircleIcon size={15} />
                      Create Ticket
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </div>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex items-center">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive"
                      onClick={handleDeleteLane}
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </DropdownMenu>
            </AlertDialog>
            <GlobalModal
              isOpen={isOpenCreateTicketModal}
              setIsOpen={setIsOpenCreateTicketModal}
              title="Create A Ticket"
              description="Tickets are a great way to keep track of tasks"
            >
              <TicketForm
                pipelineId={pipelineId}
                setTicketList={setTicketList}
                setIsOpen={setIsOpenCreateTicketModal}
                getNewTicket={addNewTicket}
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
