"use client";
import Loader from "@/components/shared/Loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { getSubAccountTeamMembers } from "@/server/actions/fetch";
import { UpsertTicket } from "@/server/actions/upsert-ticket/schema";
import { useCurrentUserStore } from "@/stores/useCurrentUser";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { User2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { type z } from "zod";

type Props = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  agencyId: string;
};

const LaborTrackingForm = ({ agencyId, setIsOpen }: Props) => {
  const ticketData = useCurrentUserStore((state) => state.ticketData);
  const { data: allTeamMembers } = useQuery({
    queryKey: ["SubAccountTeamMembers", agencyId],
    queryFn: () => getSubAccountTeamMembers(agencyId),
  });

  const [contact, setContact] = useState<string>(ticketData?.customerId ?? "");
  const [assignedTo, setAssignedTo] = useState<string>(
    ticketData?.assignedUserId ?? "",
  );

  const defaultValue = {
    agencyId: agencyId,
    ticketId: ticketData?.id,
    assignedUserId: assignedTo === "" ? null : assignedTo,
    customerId: contact === "" ? null : contact,
    description: ticketData?.description ?? "",
    name: ticketData?.name ?? "",
    value: String(ticketData?.value ?? 0),
  };

  const form = useForm<z.infer<typeof UpsertTicket>>({
    resolver: zodResolver(UpsertTicket),
    defaultValues: defaultValue,
  });

  useEffect(() => {
    if (ticketData) {
      form.reset(defaultValue);
      if (ticketData.customerId) {
        setContact(ticketData.customerId);
        setAssignedTo(ticketData.assignedUserId ?? "");
      }
    }
  }, [ticketData]);

  const onSubmit = async (values: z.infer<typeof UpsertTicket>) => {
    console.log(values);
  };

  return (
    <div className={cn("space-y-12")}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <FormLabel
              htmlFor="country"
              className="block text-sm font-medium leading-6 text-foreground"
            >
              Assigned to team member
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

          <div className="flex w-full flex-row justify-end">
            <Button className="w-full" disabled={false} type="submit">
              {false ? (
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

export default LaborTrackingForm;
