"use client";
import Loader from "@/components/shared/Loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { getContacts, getSubAccountTeamMembers } from "@/server/actions/fetch";
import { upsertTicket } from "@/server/actions/upsert-ticket";
import { UpsertTicket } from "@/server/actions/upsert-ticket/schema";
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
  setTicketList: React.Dispatch<React.SetStateAction<TicketWithTags>>;
};

const TicketForm = ({
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
  const queryClient = useQueryClient();

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

  const form = useForm<z.infer<typeof UpsertTicket>>({
    resolver: zodResolver(UpsertTicket),
    defaultValues: defaultValue,
  });

  const { execute: executeCreateTicket, isLoading } = useAction(upsertTicket, {
    onSuccess: (data) => {
      if (data) {
        setTicketList((prev) => {
          let count = 0;
          const newTickets = prev.map((prev) => {
            // If data is an update
            if (prev.id === data.id) {
              count++;
              return data;
            }
            return prev;
          });
          // If mew data
          if (count === 0) {
            newTickets.push(data);
          }

          return newTickets;
        });
        toast.success("Success", {
          description: "New ticket added.",
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

  const onSubmit = async (values: z.infer<typeof UpsertTicket>) => {
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
    <div className={cn("space-y-12")}>
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
                <FormLabel
                  htmlFor="name"
                  className="block text-sm font-medium leading-6 text-foreground"
                >
                  Ticket name
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    id="name"
                    autoComplete="ticket-name"
                    {...field}
                    className={cn(
                      "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                      "splash-base-input splash-inputs",
                    )}
                    placeholder="Ticket name"
                  />
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
                <FormLabel
                  htmlFor="description"
                  className="block text-sm font-medium leading-6 text-foreground"
                >
                  Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    id="description"
                    rows={3}
                    placeholder="Description"
                    {...field}
                    className={cn(
                      "block w-full rounded-md shadow-sm ring-offset-card placeholder:text-gray-400 focus:ring-2 sm:text-sm sm:leading-6 dark:placeholder:text-gray-600",
                      "splash-base-input splash-inputs",
                    )}
                  />
                </FormControl>
                <FormDescription className="mt-3 text-sm font-normal leading-6 text-muted-foreground">
                  Write about the ticket.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  htmlFor="value"
                  className="block text-sm font-medium leading-6 text-foreground"
                >
                  Ticket value
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    id="value"
                    autoComplete="value"
                    {...field}
                    onFocus={(e) => e.target.select()}
                    className={cn(
                      "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                      "splash-base-input splash-inputs",
                    )}
                    placeholder="Value"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Label className="block text-sm font-medium leading-6 text-foreground">
            Add tags
          </Label>
          <TagCreator
            pipelineId={pipelineId}
            subAccountId={subaccountId}
            getSelectedTags={setTags}
            defaultTags={ticketData?.Tags ?? []}
          />
          <FormLabel
            htmlFor="country"
            className="block text-sm font-medium leading-6 text-foreground"
          >
            Assigned To Team Member
          </FormLabel>
          <Select onValueChange={setAssignedTo} defaultValue={assignedTo}>
            <SelectTrigger
              className={cn(
                "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                "splash-base-input splash-inputs",
              )}
            >
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
            <SelectContent className="bg-drop-downmenu" role="dialog">
              {allTeamMembers?.map((teamMember) => (
                <SelectItem
                  key={teamMember.id}
                  value={teamMember.id}
                  role="menuitem"
                >
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
            <PopoverTrigger
              asChild
              className={cn(
                "w-full font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                "splash-base-input splash-inputs",
              )}
            >
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
            <PopoverContent
              className={cn(
                "w-[400px] border-[1px] border-slate-200 bg-card p-0 font-normal placeholder:text-gray-400 dark:border-slate-700 dark:placeholder:text-gray-600",
              )}
            >
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
          <div className="flex w-full flex-row justify-end">
            <Button className="w-full" disabled={isLoading} type="submit">
              {isLoading ? (
                <Loader classNames="h-4 w-4 border-2 border-slate-400/80 dark:border-slate-500/80 animate-[spin_.5s_linear_infinite] brightness-100 saturate-200 !border-r-transparent" />
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default TicketForm;
