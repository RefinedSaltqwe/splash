"use client";
import {
  type EditorElement,
  useEditor,
} from "@/components/providers/editor/EditorProvider";
import { Badge } from "@/components/ui/badge";
import { type EditorBtns } from "@/constants/defaultsValues";
import clsx from "clsx";
import { Trash } from "lucide-react";
import React from "react";

type Props = {
  element: EditorElement;
};

const VideoComponent = (props: Props) => {
  const { dispatch, state } = useEditor();
  const styles = props.element.styles;

  const handleDragStart = (e: React.DragEvent, type: EditorBtns) => {
    if (type === null) return;
    e.dataTransfer.setData("componentType", type);
  };

  const handleOnClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {
        elementDetails: props.element,
      },
    });
  };

  const handleDeleteElement = () => {
    dispatch({
      type: "DELETE_ELEMENT",
      payload: { elementDetails: props.element },
    });
  };

  return (
    <div
      style={styles}
      draggable
      onDragStart={(e) => handleDragStart(e, "video")}
      onClick={handleOnClick}
      className={clsx(
        "relative m-[5px] flex w-full items-center justify-center p-[2px] text-[16px] transition-all",
        {
          "!border-blue-500":
            state.editor.selectedElement.id === props.element.id,
          "!border-solid": state.editor.selectedElement.id === props.element.id,
          "border-[1px] border-dashed border-slate-300": !state.editor.liveMode,
        },
      )}
    >
      {state.editor.selectedElement.id === props.element.id &&
        !state.editor.liveMode && (
          <Badge className="absolute -left-[1px] -top-[23px] rounded-none rounded-t-lg ">
            {state.editor.selectedElement.name}
          </Badge>
        )}

      {!Array.isArray(props.element.content) && (
        <iframe
          width={props.element.styles.width ?? "560"}
          height={props.element.styles.height ?? "315"}
          src={props.element.content.src}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        />
      )}

      {state.editor.selectedElement.id === props.element.id &&
        !state.editor.liveMode && (
          <div className="absolute -right-[1px] -top-[25px] rounded-none rounded-t-lg bg-primary  px-2.5 py-1 text-xs font-bold !text-white">
            <Trash
              className="cursor-pointer"
              size={16}
              onClick={handleDeleteElement}
            />
          </div>
        )}
    </div>
  );
};

export default VideoComponent;
