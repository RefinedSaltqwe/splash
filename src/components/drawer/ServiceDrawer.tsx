"use client";
import ServiceForm from "@/app/(dashboard)/admin/services/_components/ServiceForm";
import { useServiceModal } from "@/stores/useServiceModal";
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

const ServiceDrawer: React.FC = () => {
  const [open, setOpen] = useState(false);
  const serviceModal = useServiceModal();
  const isOpen = useServiceModal((state) => state.isOpen);
  const onClose = useServiceModal((state) => state.onClose);
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
            <DialogTitle>{serviceModal.title} Service</DialogTitle>
            <DialogDescription>
              {serviceModal.description} Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <ServiceForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit profile</DrawerTitle>
          <DrawerDescription>
            Make changes to your profile here. Click save when you're done.
          </DrawerDescription>
        </DrawerHeader>
        <ServiceForm className="px-4 pb-4" />
      </DrawerContent>
    </Drawer>
  );
};
export default ServiceDrawer;
