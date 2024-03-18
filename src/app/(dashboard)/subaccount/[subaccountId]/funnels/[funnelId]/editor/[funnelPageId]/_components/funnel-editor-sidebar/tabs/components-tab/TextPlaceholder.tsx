import { type EditorBtns } from "@/constants/defaultsValues";
import { TypeIcon } from "lucide-react";
import React from "react";

type TextPlaceholderProps = object;

const TextPlaceholder = (props: TextPlaceholderProps) => {
  const handleDragState = (e: React.DragEvent, type: EditorBtns) => {
    if (type === null) return;
    e.dataTransfer.setData("componentType", type);
  };

  return (
    <div
      draggable
      onDragStart={(e) => {
        handleDragState(e, "text");
      }}
      className=" flex h-14 w-14 items-center justify-center rounded-lg bg-muted"
    >
      <TypeIcon size={40} className="text-muted-foreground" />
    </div>
  );
};

export default TextPlaceholder;
