"use client";
import GlobalModal from "@/components/drawer/GlobalModal";
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
import { useAction } from "@/hooks/useAction";
import { cn } from "@/lib/utils";
import { deleteSchedule } from "@/server/actions/delete-schedule";
import { upsertSchedule } from "@/server/actions/upsert-schedule";
import { UpsertSchedule } from "@/server/actions/upsert-schedule/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { type LaborTracking, type User } from "@prisma/client";
import { User2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";

type Props = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  agencyId: string;
  allTeamMembers: User[];
  setAllEvents: React.Dispatch<React.SetStateAction<LaborTracking[]>>;
  payload?: LaborTracking;
};

const LaborTrackingForm = ({
  agencyId,
  setIsOpen,
  allTeamMembers,
  setAllEvents,
  payload,
}: Props) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const defaultValue = {
    userId: payload?.userId ?? "",
    description: payload?.description ?? "",
  };

  const form = useForm<z.infer<typeof UpsertSchedule>>({
    resolver: zodResolver(UpsertSchedule),
    defaultValues: defaultValue,
  });

  const { execute: executeUpsertSchedule, isLoading: upsertingSchedule } =
    useAction(upsertSchedule, {
      onSuccess: (data) => {
        setAllEvents((prev) => {
          return payload?.userId
            ? prev.map((item) => (item.id === data.id ? data : item))
            : [...prev, data];
        });
      },
      onError: (error) => {
        toast.error(error);
      },
      onComplete: () => {
        setIsOpen(false);
      },
    });

  const { execute: executeDeleteSchedule, isLoading: deletingSchedule } =
    useAction(deleteSchedule, {
      onSuccess: () => {
        toast.success("Deleted"),
          setAllEvents((prev) => [
            ...prev.filter((event) => event.id !== payload?.id),
          ]);
      },
      onError: (error) => {
        toast.error(error);
      },
      onComplete: () => {
        setIsOpen(false);
        setShowDeleteModal(false);
      },
    });

  const onSubmit = (values: z.infer<typeof UpsertSchedule>) => {
    if (!values.userId) {
      toast.error("Error adding schedule", {
        description: "Employee is required.",
      });
      return;
    }
    const name = allTeamMembers.filter((user) => user.id === values.userId);

    void executeUpsertSchedule({
      ...payload,
      id: payload?.id === "" ? undefined : payload?.id,
      userId: values.userId,
      description: values.description ?? "",
      title: `${name[0]?.firstName.split(" ")[0]} ${name[0]?.lastName}`,
      agencyId,
    });
  };

  function handleDelete() {
    const ids: string[] = [];

    ids.push(payload?.id ?? "");
    void executeDeleteSchedule({
      ids,
    });
  }

  return (
    <div className={cn("space-y-12")}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  htmlFor="Assigned"
                  className="block text-sm font-medium leading-6 text-foreground"
                >
                  Assigned to
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger
                      id="Assigned"
                      {...field}
                      className={cn(
                        "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                        "splash-base-input splash-inputs",
                      )}
                      aria-placeholder="Assigned"
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
                  </FormControl>
                  <SelectContent
                    className={cn(
                      "border-[1px] border-slate-200 bg-card font-normal placeholder:text-gray-400 dark:border-slate-700 dark:placeholder:text-gray-600",
                    )}
                  >
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
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex w-full flex-col-reverse justify-between gap-3 md:flex-row md:gap-11">
            {payload?.userId && (
              <Button
                className="w-full md:w-24"
                disabled={upsertingSchedule}
                type="button"
                onClick={() => setShowDeleteModal(true)}
                variant={"destructive"}
              >
                {upsertingSchedule ? (
                  <Loader classNames="h-4 w-4 border-2 border-white/80 animate-[spin_.5s_linear_infinite] brightness-100 saturate-200 !border-r-transparent" />
                ) : (
                  "Delete"
                )}
              </Button>
            )}
            <Button
              className="w-full"
              disabled={upsertingSchedule}
              type="submit"
            >
              {upsertingSchedule ? (
                <Loader classNames="h-4 w-4 border-2 border-white/80 animate-[spin_.5s_linear_infinite] brightness-100 saturate-200 !border-r-transparent" />
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </form>
      </Form>
      <GlobalModal
        isOpen={showDeleteModal}
        setIsOpen={setShowDeleteModal}
        title={`Are you sure you want to delete this schedule?`}
        description="This action cannot be undone. This will permanently delete your data from our servers."
      >
        <div className="flex w-full flex-col justify-end gap-3 md:flex-row">
          <Button
            type="button"
            className="w-full"
            variant={"just_outline"}
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="w-full"
            variant={"destructive"}
            onClick={handleDelete}
            disabled={deletingSchedule}
          >
            <span className="sr-only">Delete</span>
            {deletingSchedule ? (
              <Loader classNames="h-4 w-4 border-2 border-white/80 animate-[spin_.5s_linear_infinite] brightness-100 saturate-200 !border-r-transparent" />
            ) : (
              "Delete"
            )}
          </Button>
        </div>
      </GlobalModal>
    </div>
  );
};

export default LaborTrackingForm;
