"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { type Dispatch, type SetStateAction } from "react";
import { useMediaQuery } from "usehooks-ts";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";

type GlobalModalProps = {
  className?: string;
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  title?: string;
  description?: string;
  withInput?: boolean;
};

const GlobalModal: React.FC<GlobalModalProps> = ({
  children,
  isOpen,
  setIsOpen,
  title,
  description,
  className,
  withInput = true,
}) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  if (isDesktop || withInput) {
    return (
      <Dialog
        open={isOpen}
        onOpenChange={(open: boolean) => {
          setIsOpen(open);
        }}
      >
        <DialogContent
          className={cn(
            "light:bg-white max-h-[90vh] gap-6 overflow-y-auto",
            className,
          )}
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open: boolean) => {
        setIsOpen(open);
      }}
    >
      <DrawerContent className={cn("max-h-[90vh] gap-6", className)}>
        <ScrollArea
          aria-orientation="vertical"
          className="overflow-y-auto break-all p-4"
        >
          <DrawerHeader className="text-left">
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          {children}
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};
export default GlobalModal;
