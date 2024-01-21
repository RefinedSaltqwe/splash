"use client";
import { useAction } from "@/hooks/useAction";
import { deleteCustomer } from "@/server/actions/delete-customer";
import { useDeleteCustomerModal } from "@/stores/useDeleteCustomerModal";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "sonner";
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
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

const DeleteCustomerModal: React.FC = () => {
  const modalId = useDeleteCustomerModal((state) => state.modalId);
  const custName = useDeleteCustomerModal((state) => state.name);
  const isOpen = useDeleteCustomerModal((state) => state.isOpen);
  const onClose = useDeleteCustomerModal((state) => state.onClose);
  const [notConfirm, setNotConfirm] = useState<boolean>(true);

  const queryClient = useQueryClient();
  const { execute } = useAction(deleteCustomer, {
    onSuccess: (data) => {
      const companyName = data.companyName;
      const custName = companyName !== "N/A" ? companyName : data.name;
      toast.success(`Customer "${custName}" has been deleted.`);
      void queryClient.invalidateQueries({
        queryKey: ["customer"],
      });
    },
    onError: (error) => {
      toast.error(error, {
        duration: 2000,
      });
    },
    onComplete: () => {
      onClose();
    },
  });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        setNotConfirm(true);
        onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`Are sure you want to delete "${custName}"?`}</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the data
            from our servers.
          </DialogDescription>
        </DialogHeader>
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
              void execute({
                id: modalId!,
              });
            }}
            disabled={notConfirm}
          >
            {"Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default DeleteCustomerModal;
