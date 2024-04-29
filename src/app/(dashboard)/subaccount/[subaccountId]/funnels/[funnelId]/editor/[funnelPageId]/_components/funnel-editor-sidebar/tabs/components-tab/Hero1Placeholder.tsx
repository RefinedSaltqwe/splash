import { type EditorBtns } from "@/constants/defaultsValues";
import { Crown } from "lucide-react";
import React from "react";

type Hero1PlaceholderProps = object;

const Hero1Placeholder = (props: Hero1PlaceholderProps) => {
  const handleDragState = (e: React.DragEvent, type: EditorBtns) => {
    if (type === null) return;
    e.dataTransfer.setData("componentType", type);
  };

  return (
    <div
      draggable
      onDragStart={(e) => {
        handleDragState(e, "hero1");
      }}
      className=" flex h-14 w-14 items-center justify-center rounded-lg bg-muted"
    >
      <Crown size={40} className="text-muted-foreground" />
    </div>
  );
};

export default Hero1Placeholder;
