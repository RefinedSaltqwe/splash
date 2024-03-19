import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { getCustomers } from "@/server/actions/fetch";
import { useAddInvoiceReceiverModal } from "@/stores/useAddInvoiceReceiverModal";
import { useCurrentUserStore } from "@/stores/useCurrentUser";
import { type Customer } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { ChevronRightIcon } from "lucide-react";
import React from "react";

type SelectRecieverModalProps = {
  addReceiver: (person: Customer) => void;
  receiver: Customer | undefined;
};

const SelectRecieverModal: React.FC<SelectRecieverModalProps> = ({
  addReceiver,
  receiver,
}) => {
  const agencyId = useCurrentUserStore((state) => state.agencyId);
  const isOpen = useAddInvoiceReceiverModal((state) => state.isOpen);
  const onClose = useAddInvoiceReceiverModal((state) => state.onClose);
  const { data: customersData } = useQuery({
    queryFn: () => getCustomers(agencyId ?? ""),
    queryKey: ["customers"],
  });

  const customers = customersData ? customersData : [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="flex w-full flex-col items-start justify-start">
          <DialogTitle>Customers</DialogTitle>
          <DialogDescription>Select receiver.</DialogDescription>
        </DialogHeader>
        <ScrollArea
          color="muted-foreground/20"
          className={cn(
            "my-auto flex h-auto max-h-96 flex-col",
            "splash-scroll shadcn-scrollarea",
          )}
        >
          <ul role="list" className="space-y-1 overflow-hidden rounded-lg">
            {customers.map((person) => (
              <li
                key={person.email}
                className={cn(
                  "relative mr-3 flex cursor-pointer justify-between gap-x-6 rounded-lg px-4 py-5 hover:bg-muted-foreground/5",
                  receiver?.id === person.id
                    ? "bg-muted-foreground/10 hover:bg-muted-foreground/10"
                    : "",
                )}
                onClick={() => {
                  addReceiver(person);
                  onClose();
                }}
              >
                <div className="flex min-w-0 gap-x-4">
                  <div className="min-w-0 flex-auto">
                    <p className="text-sm font-semibold leading-6 text-foreground">
                      <span>
                        <span className="absolute inset-x-0 -top-px bottom-0" />
                        {person.name}
                      </span>
                    </p>
                    <p className="text-[12px] font-normal leading-6 text-primary">
                      <span>
                        <span className="relative truncate" />
                        {person.companyName}
                      </span>
                    </p>
                    <p className="text-sm font-normal leading-6 text-muted-foreground">
                      <span>
                        <span className="relative truncate" />
                        {person.address}
                      </span>
                    </p>
                    <p className="mt-1 flex text-xs leading-5 text-muted-foreground">
                      <span className="relative truncate">
                        {person.phoneNumber}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-x-4">
                  <ChevronRightIcon
                    className="h-5 w-5 flex-none text-gray-400"
                    aria-hidden="true"
                  />
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
export default SelectRecieverModal;
