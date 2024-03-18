import { type EditorBtns } from "@/constants/defaultsValues";
import { Contact2Icon } from "lucide-react";
import React from "react";

type ContactFormComponentPlaceholderProps = object;

const ContactFormComponentPlaceholder = (
  props: ContactFormComponentPlaceholderProps,
) => {
  const handleDragStart = (e: React.DragEvent, type: EditorBtns) => {
    if (type === null) return;
    e.dataTransfer.setData("componentType", type);
  };
  return (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, "contactForm")}
      className=" flex h-14 w-14 items-center justify-center rounded-lg bg-muted"
    >
      <Contact2Icon size={40} className="text-muted-foreground" />
    </div>
  );
};

export default ContactFormComponentPlaceholder;
