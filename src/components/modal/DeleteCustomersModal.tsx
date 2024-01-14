"use client";
import { useDeleteCustomersModal } from "@/stores/useDeleteCustomersModal";
import React from "react";
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
  const modalIds = useDeleteCustomersModal((state) => state.modalIds);
  const isOpen = useDeleteCustomersModal((state) => state.isOpen);
  const onClose = useDeleteCustomersModal((state) => state.onClose);
  const onIsProceed = useDeleteCustomersModal((state) => state.onIsProceed);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
              onIsProceed(true);
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default DeleteCustomerModal;
