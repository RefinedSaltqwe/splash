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
import {
  CalendarIcon,
  CheckIcon,
  ChevronsUpDownIcon,
  Flame,
  User2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";
import TagCreator from "../TagCreator";
import { Checkbox } from "@/components/ui/checkbox";
import { addDays, format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import GlobalModal from "@/components/drawer/GlobalModal";

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
  const setTicketData = useCurrentUserStore((state) => state.setTicketData);
  const { data: allTeamMembers } = useQuery({
    queryKey: ["SubAccountTeamMembers", subaccountId],
    queryFn: () => getSubAccountTeamMembers(subaccountId),
  });
  const { data: contactListData } = useQuery({
    queryKey: ["ContactList", subaccountId],
    queryFn: () => getContacts(),
  });

  const [tags, setTags] = useState<Tag[]>([]);
  const [contact, setContact] = useState<string>(ticketData?.customerId ?? "");
  const [isPriority, setIsPriority] = useState<boolean>(
    ticketData?.priority ?? false,
  );
  const [isDeadLine, setIsDeadline] = useState<boolean>(false);
  const [contactList, setContactList] = useState<Contact[]>([]);
  const [assignedTo, setAssignedTo] = useState<string>(
    ticketData?.assignedUserId ?? "",
  );
  const [dueDate, setDueDate] = useState<Date | null>(
    ticketData?.deadline ?? null,
  );

  const queryClient = useQueryClient();

  const defaultValue = {
    subAccountId: subaccountId,
    laneId,
    priority: isPriority,
    deadline: dueDate,
    ticketId: ticketData?.id,
    assignedUserId: assignedTo === "" ? null : assignedTo,
    customerId: contact === "" ? null : contact,
    description: ticketData?.description ?? "",
    name: ticketData?.name ?? "",
    value: String(ticketData?.value ?? 0),
    tags,
  };

  const form = useForm<z.infer<typeof UpsertTicket>>({
    resolver: zodResolver(UpsertTicket),
    defaultValues: defaultValue,
  });

  const { execute: executeUpsertTicket, isLoading } = useAction(upsertTicket, {
    onSuccess: (data) => {
      if (data) {
        let count = 0;
        setTicketList((prev) => {
          const newTickets = prev.map((prev) => {
            // If data is an update
            if (prev.id === data.id) {
              count++;
              return data;
            }
            return prev;
          });
          // If new data
          if (count === 0) {
            newTickets.push(data);
          }

          return newTickets;
        });

        if (count === 0) {
          toast.success("Success", {
            description: "New ticket added.",
          });
        } else {
          toast.success("Success", {
            description: "Ticket updated.",
          });
        }

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
      setTicketData(undefined);
    },
  });

  useEffect(() => {
    setContactList(contactListData ?? []);
  }, [contactListData]);

  useEffect(() => {
    if (ticketData) {
      form.reset(defaultValue);
      if (ticketData.customerId) {
        setContact(ticketData.customerId);
        setAssignedTo(ticketData.assignedUserId ?? "");
        setContactList(contactListData ?? []);
      }
    }
  }, [ticketData]);

  const onSubmit = async (values: z.infer<typeof UpsertTicket>) => {
    if (!laneId) return;
    void executeUpsertTicket({
      ...values,
      assignedUserId: assignedTo === "" ? null : assignedTo,
      customerId: contact === "" ? null : contact,
      tags,
      deadline: dueDate,
      priority: isPriority,
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
              <FormItem className="w-full">
                <FormLabel
                  htmlFor="name"
                  className="block text-sm font-medium leading-6 text-foreground"
                >
                  Ticket name
                </FormLabel>
                <FormControl>
                  <div
                    className={cn(
                      "flex w-full justify-between rounded-md py-0.5 shadow-sm ring-offset-card",
                      "splash-inputs-within splash-base-input",
                    )}
                  >
                    <Input
                      type="text"
                      id="name"
                      {...field}
                      className="block flex-1 border-0 bg-transparent py-2 pl-3 font-normal text-foreground placeholder:text-gray-400 focus:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 sm:text-sm sm:leading-6 dark:placeholder:text-gray-600"
                      placeholder="Project or Task"
                    />
                    <div className="flex items-center space-x-2 pr-3">
                      <Checkbox
                        id="terms"
                        checked={isPriority}
                        onCheckedChange={(value) => {
                          setIsPriority(!!value);
                        }}
                      />
                      <label
                        htmlFor="terms"
                        className="text-muret-foreground text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        <span className="flex flex-row items-center justify-center">
                          <span>Priority</span>
                          <Flame
                            size={20}
                            className={cn(
                              "ml-2 text-muted-foreground",
                              isPriority && "text-orange-500",
                            )}
                          />
                        </span>
                      </label>
                    </div>
                  </div>
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
          <div className="flex flex-col gap-2">
            <Label className="block text-sm font-medium leading-6 text-foreground">
              Add tags
            </Label>
            <TagCreator
              pipelineId={pipelineId}
              subAccountId={subaccountId}
              getSelectedTags={setTags}
              defaultTags={ticketData?.Tags ?? []}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="deadline"
              className="block text-sm font-medium leading-6 text-foreground"
            >
              Deadline
            </Label>
            <div className="flex w-full flex-row items-center gap-2">
              <Button
                id="deadline"
                variant={"outline"}
                onClick={() => setIsDeadline(true)}
                type="button"
                asChild
                className={cn(
                  "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                  "splash-base-input splash-inputs",
                )}
              >
                <Button
                  variant={"outline"}
                  type="button"
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !dueDate && "text-muted-foreground",
                  )}
                >
                  {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </Button>
              <span
                className="text-red-500 hover:cursor-pointer hover:underline"
                onClick={() => setDueDate(null)}
              >
                Clear
              </span>
            </div>

            <GlobalModal
              isOpen={isDeadLine}
              setIsOpen={setIsDeadline}
              className="w-auto"
            >
              <Select
                onValueChange={(value) => {
                  setDueDate(addDays(new Date(), parseInt(value)));
                }}
              >
                <SelectTrigger
                  className={cn(
                    "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                    "splash-base-input splash-inputs",
                  )}
                  aria-placeholder="date"
                >
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  className={cn(
                    "border-[1px] border-slate-200 bg-card font-normal placeholder:text-gray-400 dark:border-slate-700 dark:placeholder:text-gray-600",
                  )}
                >
                  <SelectItem
                    value="0"
                    className="hover:!bg-muted-foreground/5"
                  >
                    Today
                  </SelectItem>
                  <SelectItem
                    value="1"
                    className="hover:!bg-muted-foreground/5"
                  >
                    Tomorrow
                  </SelectItem>
                  <SelectItem
                    value="3"
                    className="hover:!bg-muted-foreground/5"
                  >
                    In 3 days
                  </SelectItem>
                  <SelectItem
                    value="7"
                    className="hover:!bg-muted-foreground/5"
                  >
                    In a week
                  </SelectItem>
                </SelectContent>
              </Select>
              <Calendar
                mode="single"
                selected={dueDate ?? undefined}
                onSelect={(value) => {
                  setDueDate(value ?? null);
                  setIsDeadline(false);
                }}
                initialFocus
              />
            </GlobalModal>
          </div>
          <div className="flex flex-col gap-2">
            <FormLabel
              htmlFor="country"
              className="block text-sm font-medium leading-6 text-foreground"
            >
              Assigned To Team Member
            </FormLabel>
            <div className="flex w-full flex-row items-center gap-2">
              <Select onValueChange={setAssignedTo} value={assignedTo}>
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
              <span
                className="text-red-500 hover:cursor-pointer hover:underline"
                onClick={() => setAssignedTo("")}
              >
                Clear
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <FormLabel>Customer</FormLabel>
            <div className="flex w-full flex-row items-center gap-2">
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
                              value={`${c.name}=${c.id}`}
                              onSelect={(currentValue) => {
                                console.log(currentValue);
                                const currentValueSplit =
                                  currentValue.split("=")[1] ?? "";
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
                                  contact === c.id
                                    ? "opacity-100"
                                    : "opacity-0",
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
              <span
                className="text-red-500 hover:cursor-pointer hover:underline"
                onClick={() => setContact("")}
              >
                Clear
              </span>
            </div>
          </div>

          <div className="flex w-full flex-row justify-end">
            <Button className="w-full" disabled={isLoading} type="submit">
              {isLoading ? (
                <Loader classNames="h-4 w-4 border-2 border-white/80 animate-[spin_.5s_linear_infinite] brightness-100 saturate-200 !border-r-transparent" />
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
