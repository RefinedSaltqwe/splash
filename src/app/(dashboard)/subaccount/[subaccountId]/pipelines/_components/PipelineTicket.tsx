/* eslint-disable @typescript-eslint/ban-ts-comment */
// import TicketForm from "@/components/forms/ticket-form";
import GlobalModal from "@/components/drawer/GlobalModal";
import LinkIcon from "@/components/icons/link";
import Loader from "@/components/shared/Loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { deleteTicket } from "@/server/actions/delete-ticket";
import { useCurrentUserStore } from "@/stores/useCurrentUser";
import { type TicketWithTags } from "@/types/stripe";
import { Draggable } from "@hello-pangea/dnd";
import { useQueryClient } from "@tanstack/react-query";
import { Contact2, Edit, MoreHorizontalIcon, Trash, User2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import TagComponent from "./TagComponent";
import TicketForm from "./form/UpsertTicket";

type Props = {
  setTicketList: React.Dispatch<React.SetStateAction<TicketWithTags>>;
  ticket: TicketWithTags[0];
  subaccountId: string;
  index: number;
  pipelineId: string;
};

const PipelineTicket = ({
  index,
  subaccountId,
  ticket,
  setTicketList,
  pipelineId,
}: Props) => {
  const [isOpenUpdateTicketModal, setIsOpenUpdateTicketModal] =
    useState<boolean>(false);
  const [isOpenDeleteTicketModal, setIsOpenDeleteTicketModal] =
    useState<boolean>(false);
  const setTicketData = useCurrentUserStore((state) => state.setTicketData);
  const queryClient = useQueryClient();

  const { execute: executeDeleteTicket, isLoading: deletingTicket } = useAction(
    deleteTicket,
    {
      onSuccess: (data) => {
        if (data) {
          setTicketList((prev) => [
            ...prev.filter((item) => item.id !== ticket.id),
          ]);
          toast.success("Success", {
            description: "Deleted ticket from lane",
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
        setIsOpenDeleteTicketModal(false);
      },
    },
  );

  return (
    <Draggable draggableId={ticket.id.toString()} index={index}>
      {(provided, snapshot) => {
        if (snapshot.isDragging) {
          //   const offset = { x: 300, y: 20 };
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
          >
            <DropdownMenu>
              <Card className="splash-border-color my-4 bg-card shadow-none transition-all">
                <CardHeader className="p-[12px]">
                  <CardTitle className="flex items-center justify-between">
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <span className="w-full max-w-[180px] overflow-hidden text-ellipsis whitespace-nowrap text-lg">
                          {ticket.name}
                        </span>
                      </HoverCardTrigger>
                      <HoverCardContent
                        side="top"
                        className="bg-drop-downmenu w-fit"
                      >
                        <span className="text-sm font-bold">{ticket.name}</span>
                      </HoverCardContent>
                    </HoverCard>

                    <DropdownMenuTrigger className="flex h-10 w-10 items-center justify-center rounded-full">
                      <MoreHorizontalIcon className="text-muted-foreground" />
                    </DropdownMenuTrigger>
                  </CardTitle>
                  <span className="text-xs text-muted-foreground">
                    {new Date().toLocaleDateString()}
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {ticket.Tags.map((tag) => (
                      <TagComponent
                        key={tag.id}
                        title={tag.name}
                        colorName={tag.color}
                      />
                    ))}
                  </div>
                  <CardDescription className="w-full ">
                    {ticket.description}
                  </CardDescription>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <div className="flex cursor-pointer items-center gap-2 rounded-lg p-2 text-muted-foreground transition-all hover:bg-muted-foreground/5">
                        <LinkIcon />
                        <span className="text-xs font-bold">CONTACT</span>
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent
                      side="right"
                      className="bg-drop-downmenu w-fit"
                    >
                      <div className="flex justify-between space-x-4">
                        <Avatar>
                          <AvatarImage />
                          <AvatarFallback className="bg-primary text-white">
                            {ticket.Customer?.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold">
                            {ticket.Customer?.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {ticket.Customer?.email}
                          </p>
                          <div className="flex items-center pt-2">
                            <Contact2 className="mr-2 h-4 w-4 opacity-70" />
                            <span className="text-xs text-muted-foreground">
                              Joined{" "}
                              {ticket.Customer?.createdAt.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </CardHeader>
                <CardFooter className="splash-border-color m-0 flex items-center justify-between border-t-[1px] p-2">
                  <div className="item-center flex gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage alt="contact" src={ticket.Assigned?.image} />
                      <AvatarFallback className="bg-primary text-sm text-white">
                        {ticket.Assigned?.name}
                        {!ticket.assignedUserId && <User2 size={14} />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col justify-center">
                      <span className="text-sm text-muted-foreground">
                        {ticket.assignedUserId ? "Assigned to" : "Not Assigned"}
                      </span>
                      {ticket.assignedUserId && (
                        <span className="w-28 overflow-hidden  overflow-ellipsis whitespace-nowrap text-xs text-muted-foreground">
                          {ticket.Assigned?.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-sm font-bold">
                    {!!ticket.value &&
                      new Intl.NumberFormat(undefined, {
                        style: "currency",
                        currency: "USD",
                      }).format(+ticket.value)}
                  </span>
                </CardFooter>
                <DropdownMenuContent className="bg-drop-downmenu" role="dialog">
                  <DropdownMenuLabel>Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="flex items-center gap-2"
                    onClick={() => {
                      setIsOpenUpdateTicketModal(true);
                      setTicketData(ticket);
                    }}
                  >
                    <Edit size={15} />
                    Edit Ticket
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="splash-red-button flex w-full items-center gap-2"
                    onClick={() => {
                      setIsOpenDeleteTicketModal(true);
                    }}
                  >
                    <Trash size={15} />
                    Delete Ticket
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </Card>
            </DropdownMenu>
            <GlobalModal
              isOpen={isOpenDeleteTicketModal}
              setIsOpen={setIsOpenDeleteTicketModal}
              title={`Are you sure you want to delete "${ticket.name}"?`}
              description="This action cannot be undone. This will permanently delete your data from our servers."
            >
              <div className="flex w-full justify-end gap-x-4">
                <Button
                  type="button"
                  variant={"ghost"}
                  onClick={() => setIsOpenDeleteTicketModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant={"destructive"}
                  onClick={() =>
                    void executeDeleteTicket({
                      pipelineId,
                      subaccountId,
                      ticketId: ticket.id,
                    })
                  }
                >
                  <span className="sr-only">Delete</span>
                  {deletingTicket ? (
                    <Loader classNames="h-4 w-4 border-2 border-slate-200/40 animate-[spin_.5s_linear_infinite] brightness-100 saturate-200 border-r-transparent" />
                  ) : (
                    "Delete"
                  )}
                </Button>
              </div>
            </GlobalModal>
            <GlobalModal
              isOpen={isOpenUpdateTicketModal}
              setIsOpen={setIsOpenUpdateTicketModal}
              title="Edit ticket details"
            >
              <TicketForm
                laneId={ticket.laneId}
                subaccountId={subaccountId}
                pipelineId={pipelineId}
                setTicketList={setTicketList}
                setIsOpen={setIsOpenUpdateTicketModal}
              />
            </GlobalModal>
          </div>
        );
      }}
    </Draggable>
  );
};

export default PipelineTicket;
