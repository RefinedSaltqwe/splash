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
import {
  getCustomers,
  getInventoryListBySubaccountId,
  getServiceTypes,
  getSuppliers,
} from "@/server/actions/fetch";
import { useCurrentUserStore } from "@/stores/useCurrentUser";
import { useDeleteManyModal } from "@/stores/useDeleteManyModal";
import { useQuery } from "@tanstack/react-query";
import React, { lazy, useEffect, useState } from "react";

const Loader = lazy(() => import("@/components/shared/Loader"));

const DeleteInvoicePrompt: React.FC = () => {
  const modalIds = useDeleteManyModal((state) => state.modalIds);
  const isOpen = useDeleteManyModal((state) => state.isOpen);
  const proceed = useDeleteManyModal((state) => state.proceed);
  const onClose = useDeleteManyModal((state) => state.onClose);
  const onIsProceed = useDeleteManyModal((state) => state.onIsProceed);
  const modalType = useDeleteManyModal((state) => state.type);
  const agencyId = useCurrentUserStore((state) => state.agencyId);
  const subaccountId = useCurrentUserStore((state) => state.subaccountId);
  const [notConfirm, setNotConfirm] = useState<boolean>(true);

  const { data: serviceTypes } = useQuery({
    queryKey: ["serviceTypes"],
    queryFn: () => getServiceTypes(agencyId ?? ""),
    enabled: modalType === "serviceType",
  });

  const { data: customers } = useQuery({
    queryKey: ["customers"],
    queryFn: () => getCustomers(agencyId ?? ""),
    enabled: modalType === "customer",
  });

  const { data: suppliers } = useQuery({
    queryKey: ["suppliers"],
    queryFn: () => getSuppliers(agencyId ?? ""),
    enabled: modalType === "supplier",
  });

  const { data: inventory } = useQuery({
    queryKey: ["inventory"],
    queryFn: () => getInventoryListBySubaccountId(subaccountId ?? ""),
    enabled: modalType === "inventory",
  });

  useEffect(() => {
    if (!proceed) {
      setNotConfirm(true);
    }
  }, [proceed]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        onClose();
        setNotConfirm(true);
      }}
    >
      <DialogContent className="gap-6">
        <DialogHeader>
          <DialogTitle>{`You are about to delete ${
            modalIds?.length && modalIds?.length > 1
              ? `${modalIds?.length} ${modalType}s`
              : `${modalIds?.length} ${modalType}`
          }. Are sure you want to proceed?`}</DialogTitle>
          <DialogDescription>
            {`This action cannot be undone. This will permanently delete all the data from our servers.`}
          </DialogDescription>
        </DialogHeader>

        <div className="flex w-full flex-row flex-wrap gap-2">
          {modalIds?.map((item) => {
            let finalName = item;
            if (modalType === "serviceType") {
              const name = serviceTypes?.filter((i) => i.id === item);
              finalName = name ? name[0]!.name : item;
            } else if (modalType === "customer") {
              const name = customers?.filter((i) => i.id === item);
              finalName = name
                ? name[0]!.companyName !== "N/A"
                  ? name[0]!.companyName
                  : name[0]!.name
                : item;
            } else if (modalType === "supplier") {
              const name = suppliers?.filter((i) => i.id === item);
              finalName = name
                ? name[0]!.companyName !== "N/A"
                  ? name[0]!.companyName
                  : name[0]!.name
                : item;
            } else if (modalType === "inventory") {
              const name = inventory?.filter((i) => i.id === item);
              finalName = name ? name[0]!.name : item;
            }
            return (
              <Badge key={item} variant={"outline"}>
                {finalName}
              </Badge>
            );
          })}
        </div>

        <div className="flex w-full flex-col gap-2">
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
        </div>

        <DialogFooter className="flex w-full flex-col justify-end gap-3 md:flex-row">
          <DialogClose asChild>
            <Button type="button" className="w-full" variant={"just_outline"}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            className="w-full"
            variant={"destructive"}
            onClick={() => {
              onIsProceed(true);
            }}
            disabled={proceed ? proceed : notConfirm}
          >
            {proceed ? (
              <Loader classNames="h-4 w-4 border-2 border-white/80 animate-[spin_.5s_linear_infinite] brightness-100 saturate-200 !border-r-transparent" />
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default DeleteInvoicePrompt;
