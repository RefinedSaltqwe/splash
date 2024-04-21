"use client";
import GenerateTimesheetForm from "@/components/shared/GenerateTimesheetForm";
import { useGenerateTimesheetModal } from "@/stores/useGenerateTimesheetModal";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";

const GenerateTimesheetDrawer: React.FC = () => {
  const [open, setOpen] = useState(false);
  const timesheetModal = useGenerateTimesheetModal();
  const isOpen = useGenerateTimesheetModal((state) => state.isOpen);
  const onClose = useGenerateTimesheetModal((state) => state.onClose);
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{timesheetModal.title}</DialogTitle>
            <DialogDescription>
              {timesheetModal.description} Click submit when you're done.
            </DialogDescription>
          </DialogHeader>
          <GenerateTimesheetForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{timesheetModal.title}</DrawerTitle>
          <DrawerDescription>
            {timesheetModal.description} Click submit when you're done.
          </DrawerDescription>
        </DrawerHeader>
        <GenerateTimesheetForm className="px-4 pb-4" />
      </DrawerContent>
    </Drawer>
  );
};
export default GenerateTimesheetDrawer;
