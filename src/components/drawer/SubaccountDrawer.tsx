"use client";
import { useSubaccountModal } from "@/stores/useSubaccountModal";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "../ui/dialog";

type ModalProps = {
  children: React.ReactNode;
};
const SubAccountDrawer: React.FC<ModalProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const subaccountModal = useSubaccountModal();
  const isOpen = useSubaccountModal((state) => state.isOpen);
  const onClose = useSubaccountModal((state) => state.onClose);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (!open) {
      onClose();
    }
  }, [open]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="z-[75]">
        <DialogContent className="z-[75] h-[80vh] sm:max-w-[525px]">
          <div className="gap-4 overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{subaccountModal.title} Sub Account</DialogTitle>
              <DialogDescription>
                {subaccountModal.description} Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            {children}
          </div>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};
export default SubAccountDrawer;
