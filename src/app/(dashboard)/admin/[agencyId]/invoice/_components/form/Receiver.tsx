import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle } from "lucide-react";
import React, { memo } from "react";
import SelectRecieverModal from "../modal/SelectReciever";
import { useAddInvoiceReceiverModal } from "@/stores/useAddInvoiceReceiverModal";
import { type Customer } from "@prisma/client";

type ReceiverProps = {
  addReceiver: (person: Customer) => void;
  receiver: Customer | undefined;
};

const Receiver: React.FC<ReceiverProps> = ({ addReceiver, receiver }) => {
  const onOpen = useAddInvoiceReceiverModal();
  return (
    <>
      <SelectRecieverModal addReceiver={addReceiver} receiver={receiver} />
      {!receiver ? (
        <div className="flex w-full flex-1 flex-row justify-between">
          <span className="text-base text-muted-foreground">To:</span>
          <div className="flex flex-row items-start">
            <Button
              size={"icon"}
              variant={"ghost"}
              type="button"
              className="rounded-full"
              onClick={() => onOpen.onOpen()}
            >
              <PlusCircle className="text-muted-foreground" size={20} />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-row">
          <div className="flex flex-1 flex-col space-y-3">
            <span className="text-base text-muted-foreground">To:</span>
            <div className="flex w-full flex-col space-y-2 text-start font-normal text-foreground">
              <span>{receiver.name}</span>
              <span>{receiver.address}</span>
              <span>{receiver.phoneNumber}</span>
            </div>
          </div>
          <div className="flex flex-row items-start">
            <Button
              size={"icon"}
              variant={"ghost"}
              className="rounded-full"
              type="button"
              onClick={() => onOpen.onOpen()}
            >
              <Pencil className="text-muted-foreground" size={20} />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
export default memo(Receiver);
