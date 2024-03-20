"use client";
import ServiceForm from "@/app/(dashboard)/admin/[agencyId]/services/_components/ServiceForm";
import { useServiceModal } from "@/stores/useServiceModal";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

const ServiceDrawer: React.FC = () => {
  const [open, setOpen] = useState(false);
  const serviceModal = useServiceModal();
  const isOpen = useServiceModal((state) => state.isOpen);
  const onClose = useServiceModal((state) => state.onClose);

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
};
export default ServiceDrawer;
