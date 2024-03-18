import { EditorBtns } from "@/constants/defaultsValues";
import React from "react";

type ContainerPlaceholderProps = object;

const ContainerPlaceholder = (props: ContainerPlaceholderProps) => {
  const handleDragStart = (e: React.DragEvent, type: EditorBtns) => {
    if (type === null) return;
    e.dataTransfer.setData("componentType", type);
  };
  return (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, "container")}
      className=" flex h-14 w-14 flex-row gap-[4px] rounded-lg bg-muted/70 p-2"
    >
      <div className="h-full w-full rounded-sm border-[1px] border-dashed border-muted-foreground/50 bg-muted" />
    </div>
  );
};

export default ContainerPlaceholder;
