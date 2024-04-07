"use client";
import Loader from "@/components/shared/Loader";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { getSuppliers } from "@/server/actions/fetch";
import { upsertInventory } from "@/server/actions/upsert-inventory";
import { UpsertInventory } from "@/server/actions/upsert-inventory/schema";
import { useCurrentUserStore } from "@/stores/useCurrentUser";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Inventory } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";

type InventoryFormProps = {
  className?: string;
  agencyId: string;
  subaccountId: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  inventoryDetails?: Inventory;
};

const InventoryForm: React.FC<InventoryFormProps> = ({
  className,
  agencyId,
  subaccountId,
  setIsOpen,
  inventoryDetails,
}) => {
  const queryClient = useQueryClient();
  const setInventoryItemData = useCurrentUserStore(
    (state) => state.setInventoryItemData,
  );
  const [supplier, setSupplier] = useState(inventoryDetails?.supplierId ?? "");
  const { data: suppliers } = useQuery({
    queryFn: () => getSuppliers(agencyId),
    queryKey: ["suppliers", agencyId],
  });

  const { execute: executeUpsertInventory, isLoading: upsertingInventory } =
    useAction(upsertInventory, {
      onSuccess: (data) => {
        //Set the data into the store. So data would update inside ClientData useCurrentStore
        setInventoryItemData(data, !!inventoryDetails ? "update" : "create");

        if (!!inventoryDetails) {
          toast.success("Success", {
            description: `Item "${data.name}" updated.`,
          });
        } else {
          toast.success("Success", {
            description: `New item "${data.name}" created.`,
          });
        }

        void queryClient.invalidateQueries({
          queryKey: ["inventory", subaccountId],
        });
      },
      onError: (error) => {
        toast.error(error, {
          duration: 5000,
        });
      },
      onComplete: () => {
        setIsOpen(false);
      },
    });

  const form = useForm<z.infer<typeof UpsertInventory>>({
    resolver: zodResolver(UpsertInventory),
    defaultValues: {
      id: inventoryDetails?.id ?? undefined,
      name: inventoryDetails?.name ?? "",
      cost: inventoryDetails?.cost ?? 0,
      quantity: inventoryDetails?.quantity ?? 0,
      description: inventoryDetails?.description,
      supplierId: inventoryDetails?.supplierId ?? "",
      subaccountId: subaccountId,
      agencyId: agencyId,
    },
  });
  function onSubmit(values: z.infer<typeof UpsertInventory>) {
    if (!supplier) {
      toast.error("Supplier is required.");
      return;
    }

    void executeUpsertInventory({
      id: values.id,
      name: values.name,
      cost: values.cost,
      quantity: values.quantity,
      description: values.description ?? "",
      supplierId: supplier,
      subaccountId: subaccountId,
      agencyId: agencyId,
    });
  }

  return (
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
                Item name
              </FormLabel>
              <FormControl>
                <Input
                  id="name"
                  type="text"
                  autoComplete="item-name"
                  {...field}
                  className={cn(
                    "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                    "splash-base-input splash-inputs",
                  )}
                  placeholder="Rebar, nail, etc"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cost"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                htmlFor="cost"
                className="block text-sm font-medium leading-6 text-foreground"
              >
                Cost
              </FormLabel>
              <FormControl>
                <div
                  className={cn(
                    "flex w-full rounded-md py-0.5 shadow-sm ring-offset-card",
                    "splash-inputs-within splash-base-input",
                  )}
                >
                  <span className="flex select-none items-center pl-3 font-bold text-gray-500 sm:text-sm">
                    $
                  </span>
                  <Input
                    {...field}
                    type="number"
                    id="cost"
                    step="0.01"
                    onFocus={(e) => e.target.select()}
                    className="flex-1 border-0 bg-transparent py-1.5 pl-1 font-normal text-foreground placeholder:text-gray-400 focus:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 sm:text-sm sm:leading-6 dark:placeholder:text-gray-600"
                    placeholder="10.00"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                htmlFor="quantity"
                className="block text-sm font-medium leading-6 text-foreground"
              >
                Quantity
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  step="0"
                  type="number"
                  id="quantity"
                  onFocus={(e) => e.target.select()}
                  className={cn(
                    "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                    "splash-base-input splash-inputs",
                  )}
                  placeholder="10"
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
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="supplier"
            className="block text-sm font-medium leading-6 text-foreground"
          >
            Supplier
          </Label>
          <Select
            onValueChange={(value) => setSupplier(value)}
            defaultValue={supplier}
          >
            <SelectTrigger
              id="supplier"
              className={cn(
                "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                "splash-base-input splash-inputs",
              )}
              aria-placeholder="supplier"
            >
              <SelectValue placeholder="Select supplier" />
            </SelectTrigger>
            <SelectContent
              className={cn(
                "border-[1px] border-slate-200 bg-card font-normal placeholder:text-gray-400 dark:border-slate-700 dark:placeholder:text-gray-600",
              )}
            >
              {suppliers?.map((item) => (
                <SelectItem value={item.id} key={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div
          className={cn(
            "mt-3 flex w-full flex-col justify-end gap-3 md:flex-row",
            className,
          )}
        >
          <Button
            type="submit"
            variant={"default"}
            className="w-full"
            disabled={upsertingInventory}
          >
            <span className="sr-only">Save</span>
            {upsertingInventory ? (
              <Loader classNames="h-4 w-4 border-2 border-white/80 animate-[spin_.5s_linear_infinite] brightness-100 saturate-200 !border-r-transparent" />
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default InventoryForm;
