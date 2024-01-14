"use client";
import { useAction } from "@/hooks/useAction";
import { deleteCustomer } from "@/server/actions/delete-customer";
import { useDeleteCustomerModal } from "@/stores/useDeleteCustomerModal";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
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

const DeleteCustomerModal: React.FC = () => {
  const modalId = useDeleteCustomerModal((state) => state.modalId);
  const custName = useDeleteCustomerModal((state) => state.name);
  const isOpen = useDeleteCustomerModal((state) => state.isOpen);
  const onClose = useDeleteCustomerModal((state) => state.onClose);

  const queryClient = useQueryClient();
  const { execute, isLoading } = useAction(deleteCustomer, {
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`Are sure you want to delete "${custName}"?`}</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the data
            from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
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
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default DeleteCustomerModal;
