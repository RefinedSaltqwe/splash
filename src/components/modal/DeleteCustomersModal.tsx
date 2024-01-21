"use client";
import { cn } from "@/lib/utils";
import { getCustomers } from "@/server/actions/fetch";
import { useDeleteManyModal } from "@/stores/useDeleteManyModal";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const DeleteCustomerModal: React.FC = () => {
  const { data } = useQuery({
    queryKey: ["customers"],
    queryFn: () => getCustomers(),
  });
  const modalIds = useDeleteManyModal((state) => state.modalIds);
  const isOpen = useDeleteManyModal((state) => state.isOpen);
  const proceed = useDeleteManyModal((state) => state.proceed);
  const onClose = useDeleteManyModal((state) => state.onClose);
  const onIsProceed = useDeleteManyModal((state) => state.onIsProceed);
  const [notConfirm, setNotConfirm] = useState<boolean>(true);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        onClose();
        setNotConfirm(true);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`You are about to delete ${
            modalIds?.length && modalIds?.length > 1
              ? `${modalIds?.length} customers`
              : `${modalIds?.length} customer`
          }. Are sure you want to proceed?`}</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the data
            from our servers.
          </DialogDescription>
        </DialogHeader>
        <div className=" flex w-full flex-row flex-wrap gap-2">
          {data?.map((person) => {
            const personId = person.id;
            if (modalIds?.includes(personId)) {
              return (
                <Badge key={personId} variant={"outline"}>
                  {person.companyName !== "N/A"
                    ? person.companyName
                    : person.name}
                </Badge>
              );
            }
          })}
        </div>
        <Label
          htmlFor="confirm"
          className="block text-sm font-medium leading-6 text-foreground"
        >
          Type "DELETE" to proceed
        </Label>
        <Input
          type="text"
          id="confirm"
          onChange={(e) => {
            if (e.target.value === "DELETE") {
              setNotConfirm(false);
            } else {
              setNotConfirm(true);
            }
          }}
          autoComplete="postal-code"
          className={cn(
            "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
            "splash-base-input splash-inputs",
          )}
          placeholder="DELETE"
        />
        <DialogFooter className="space-y-4 space-y-reverse sm:justify-end sm:space-x-4 sm:space-y-0">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant={"destructive"}
            onClick={() => {
              onIsProceed(true);
            }}
            disabled={proceed ? proceed : notConfirm}
          >
            {proceed ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default DeleteCustomerModal;
