import { type EditorBtns } from "@/constants/defaultsValues";
import Image from "next/image";
import React from "react";

type CheckoutPlaceholderProps = object;

const CheckoutPlaceholder = (props: CheckoutPlaceholderProps) => {
  const handleDragStart = (e: React.DragEvent, type: EditorBtns) => {
    if (type === null) return;
    e.dataTransfer.setData("componentType", type);
  };
  return (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, "paymentForm")}
      className=" flex h-14 w-14 items-center justify-center rounded-lg bg-muted"
    >
      <Image
        src="/assets/icons/stripelogo.png"
        height={40}
        width={40}
        alt="stripe logo"
        className="object-cover"
      />
    </div>
  );
};

export default CheckoutPlaceholder;
