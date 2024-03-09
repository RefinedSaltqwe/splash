"use client";
import Loader from "@/components/shared/Loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAction } from "@/hooks/useAction";
import { cn } from "@/lib/utils";
import { createTicket } from "@/server/actions/create-ticket";
import { CreateTicket } from "@/server/actions/create-ticket/schema";
import { getContacts, getSubAccountTeamMembers } from "@/server/actions/fetch";
import { useCurrentUserStore } from "@/stores/useCurrentUser";
import { type TicketWithTags } from "@/types/stripe";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Contact, type Tag } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckIcon, ChevronsUpDownIcon, User2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";
import TagCreator from "../TagCreator";

type Props = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  laneId: string;
  pipelineId: string;
  subaccountId: string;
  getNewTicket: (ticket: TicketWithTags[0]) => void;
  setTicketList: React.Dispatch<React.SetStateAction<TicketWithTags>>;
};

const TicketForm = ({
  getNewTicket,
  laneId,
  subaccountId,
  setIsOpen,
  setTicketList,
  pipelineId,
}: Props) => {
  const ticketData = useCurrentUserStore((state) => state.ticketData);
  const { data: allTeamMembers } = useQuery({
    queryKey: ["SubAccountTeamMembers", subaccountId],
    queryFn: () => getSubAccountTeamMembers(subaccountId),
  });
  const { data: contactListData } = useQuery({
    queryKey: ["ContactList", subaccountId],
    queryFn: () => getContacts(),
  });

  const [tags, setTags] = useState<Tag[]>([]);
  const [contact, setContact] = useState("");
  const [contactList, setContactList] = useState<Contact[]>([]);
  const [assignedTo, setAssignedTo] = useState(ticketData?.Assigned?.id ?? "");

  const defaultValue = {
    subAccountId: subaccountId,
    laneId,
    ticketId: ticketData?.id,
    assignedUserId: assignedTo,
    description: ticketData?.description ?? "",
    name: ticketData?.name ?? "",
    value: String(ticketData?.value ?? 0),
    customerId: contact,
    tags,
  };

  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof CreateTicket>>({
    resolver: zodResolver(CreateTicket),
    defaultValues: defaultValue,
  });

  const { execute: executeCreateTicket, isLoading } = useAction(createTicket, {
    onSuccess: (data) => {
      if (data) {
        setTicketList((prev) => [...prev, data]);
        toast.success("Saved details");
        void queryClient.invalidateQueries({
          queryKey: ["lanes", pipelineId],
        });
        getNewTicket(data);
      }
    },
    onError: (error) => {
      toast.error(error);
    },
    onComplete: () => {
      setIsOpen(false);
      setTags([]);
      setContact("");
      setAssignedTo("");
    },
  });

  useEffect(() => {
    setContactList(contactListData ?? []);
  }, [contactListData]);

  useEffect(() => {
    if (ticketData) {
      form.reset(defaultValue);
      if (ticketData.customerId) setContact(ticketData.customerId);

      setContactList(contactListData ?? []);
    }
  }, [ticketData]);

  const onSubmit = async (values: z.infer<typeof CreateTicket>) => {
    if (!laneId) return;
    if (assignedTo.length < 3) {
      toast.error("Assigned user is required");
      return;
    }
    if (contact.length < 3) {
      toast.error("Customer is required");
      return;
    }
    void executeCreateTicket({
      ...values,
      assignedUserId: assignedTo,
      customerId: contact,
      tags,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Ticket Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ticket Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ticket Value</FormLabel>
                  <FormControl>
                    <Input placeholder="Value" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <h3>Add tags</h3>
            <TagCreator
              subAccountId={subaccountId}
              getSelectedTags={setTags}
              defaultTags={ticketData?.Tags ?? []}
            />
            <FormLabel>Assigned To Team Member</FormLabel>
            <Select onValueChange={setAssignedTo} defaultValue={assignedTo}>
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage alt="contact" />
                        <AvatarFallback className="bg-primary text-sm text-white">
                          <User2 size={14} />
                        </AvatarFallback>
                      </Avatar>

                      <span className="text-sm text-muted-foreground">
                        Not Assigned
                      </span>
                    </div>
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {allTeamMembers?.map((teamMember) => (
                  <SelectItem key={teamMember.id} value={teamMember.id}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage alt="contact" src={teamMember.image} />
                        <AvatarFallback className="bg-primary text-sm text-white">
                          <User2 size={14} />
                        </AvatarFallback>
                      </Avatar>

                      <span className="text-sm text-muted-foreground">
                        {teamMember.name}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormLabel>Customer</FormLabel>
            <Popover>
              <PopoverTrigger asChild className="w-full">
                <Button
                  variant="outline"
                  role="combobox"
                  className="justify-between"
                >
                  {contact
                    ? contactList.find((c) => c.id === contact)?.name
                    : "Select Customer..."}
                  <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0">
                <Command>
                  <CommandInput placeholder="Search..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>No Customer found.</CommandEmpty>
                    <CommandGroup>
                      {contactList?.map((c) => {
                        return (
                          <CommandItem
                            key={`${c.name}-${c.id}`}
                            value={`${c.name}-${c.id}`}
                            onSelect={(currentValue) => {
                              const currentValueSplit =
                                currentValue.split("-")[1] ?? "";
                              setContact(
                                currentValueSplit === contact
                                  ? ""
                                  : currentValueSplit,
                              );
                            }}
                          >
                            <span>{c.name}</span>
                            <CheckIcon
                              className={cn(
                                "ml-auto h-4 w-4",
                                contact === c.id ? "opacity-100" : "opacity-0",
                              )}
                            />
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <Button className="mt-4 w-20" disabled={isLoading} type="submit">
              {isLoading ? (
                <Loader classNames="h-4 w-4 border-2 border-slate-200/40 animate-[spin_.5s_linear_infinite] brightness-100 saturate-200 border-r-transparent" />
              ) : (
                "Save"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TicketForm;
