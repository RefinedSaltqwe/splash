"use client";
import { useSubaccountModal } from "@/stores/useSubaccountModal";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "../ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerOverlay,
  DrawerTitle,
} from "../ui/drawer";

type ModalProps = {
  children: React.ReactNode;
};
const SubAccountDrawer: React.FC<ModalProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const subaccountModal = useSubaccountModal();
  const isOpen = useSubaccountModal((state) => state.isOpen);
  const onClose = useSubaccountModal((state) => state.onClose);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (!open) {
      onClose();
    }
  }, [open]);

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogOverlay className="z-[199]">
          <DialogContent className="z-[200] h-[80vh] sm:max-w-[525px]">
            <div className="gap-4 overflow-y-scroll">
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
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="z-[2000] h-[80vh] md:max-w-[525px]">
        <div className="gap-4 overflow-y-scroll">
          <DrawerHeader className="text-left">
            <DrawerTitle>Edit profile</DrawerTitle>
            <DrawerDescription>
              Make changes to your profile here. Click save when you're done.
            </DrawerDescription>
          </DrawerHeader>
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
export default SubAccountDrawer;
