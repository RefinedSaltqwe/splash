"use client";
import Loader from "@/components/shared/Loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { zodResolver } from "@hookform/resolvers/zod";
import { type LaborTracking, type User } from "@prisma/client";
import { User2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { v4 } from "uuid";
import { z } from "zod";

type Props = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  agencyId: string;
  allTeamMembers: User[];
  setAllEvents: React.Dispatch<React.SetStateAction<LaborTracking[]>>;
  newEvent: LaborTracking;
};

const LaborTrackingUpsert = z.object({
  userId: z.string(),
  description: z.string().default("").optional(),
});

const LaborTrackingForm = ({
  agencyId,
  setIsOpen,
  allTeamMembers,
  setAllEvents,
  newEvent,
}: Props) => {
  const [assignedTo, setAssignedTo] = useState<string>("");

  const defaultValue = {
    userId: "",
    description: "",
  };

  const form = useForm<z.infer<typeof LaborTrackingUpsert>>({
    resolver: zodResolver(LaborTrackingUpsert),
    defaultValues: defaultValue,
  });

  const onSubmit = (values: z.infer<typeof LaborTrackingUpsert>) => {
    const name = allTeamMembers.filter((user) => user.id === assignedTo);
    setAllEvents((prev) => [
      ...prev,
      {
        ...newEvent,
        id: v4(),
        userId: assignedTo,
        description: values.description ?? "",
        title: `${name[0]?.firstName.split(" ")[0]} ${name[0]?.lastName}`,
        agencyId,
      },
    ]);
    setIsOpen(false);
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
              Assigned to
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
