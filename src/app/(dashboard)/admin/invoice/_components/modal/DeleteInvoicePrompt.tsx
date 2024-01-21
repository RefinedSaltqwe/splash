"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useDeleteInvoiceModal } from "@/stores/useDeleteInvoiceModal";
import React, { useState } from "react";

const DeleteInvoicePrompt: React.FC = () => {
  const modalIds = useDeleteInvoiceModal((state) => state.modalIds);
  const isOpen = useDeleteInvoiceModal((state) => state.isOpen);
  const proceed = useDeleteInvoiceModal((state) => state.proceed);
  const onClose = useDeleteInvoiceModal((state) => state.onClose);
  const onIsProceed = useDeleteInvoiceModal((state) => state.onIsProceed);
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
              ? `${modalIds?.length} invoices`
              : `${modalIds?.length} invoice`
          }. Are sure you want to proceed?`}</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the data
            from our servers.
          </DialogDescription>
        </DialogHeader>
        <div className="flex w-full flex-row flex-wrap gap-2">
          {modalIds?.map((item) => {
            return (
              <Badge key={item} variant={"outline"}>
                {item}
              </Badge>
            );
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
export default DeleteInvoicePrompt;
