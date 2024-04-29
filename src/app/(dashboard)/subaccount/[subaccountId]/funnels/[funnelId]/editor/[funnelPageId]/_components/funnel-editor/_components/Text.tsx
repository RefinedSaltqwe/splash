"use client";
import {
  type EditorElement,
  useEditor,
} from "@/components/providers/EditorProvider";
import { Badge } from "@/components/ui/badge";
import { useDivSpacer } from "@/stores/funnelDivSpacer";
import clsx from "clsx";
import { Trash } from "lucide-react";
import React from "react";

type Props = {
  element: EditorElement;
  index: number;
  level: number;
};

const TextComponent = (props: Props) => {
  const { dispatch, state } = useEditor();
  const onOpen = useDivSpacer((state) => state.onOpen);
  const onClose = useDivSpacer((state) => state.onClose);

  const handleDeleteElement = () => {
    onClose();
    dispatch({
      type: "DELETE_ELEMENT",
      payload: { elementDetails: props.element },
    });
  };
  const styles = props.element.styles;

  const handleOnClickBody = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (props.index === 0 && props.level === 2) {
      onOpen();
    } else {
      onClose();
    }
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {
        elementDetails: props.element,
      },
    });
  };

  //WE ARE NOT ADDING DRAG DROP
  return (
    <div
      style={styles}
      className={clsx(
        "relative m-0 w-full p-[2px] text-[16px] transition-all",
        {
          "!border-blue-500":
            state.editor.selectedElement.id === props.element.id,

          "!border-solid": state.editor.selectedElement.id === props.element.id,
          "border-[1px] border-dashed border-slate-300": !state.editor.liveMode,
        },
      )}
      onClick={handleOnClickBody}
    >
      {state.editor.selectedElement.id === props.element.id &&
        !state.editor.liveMode && (
          <Badge className="absolute -left-[1px] -top-[23px] rounded-none rounded-t-lg">
            {state.editor.selectedElement.name}
          </Badge>
        )}
      <span
        suppressContentEditableWarning={true}
        contentEditable={!state.editor.liveMode}
        onBlur={(e) => {
          const spanElement = e.target as HTMLSpanElement;
          dispatch({
            type: "UPDATE_ELEMENT",
            payload: {
              elementDetails: {
                ...props.element,
                content: {
                  innerText: spanElement.innerText,
                },
              },
            },
          });
        }}
      >
        {!Array.isArray(props.element.content) &&
          props.element.content.innerText}
      </span>
      {state.editor.selectedElement.id === props.element.id &&
        !state.editor.liveMode && (
          <div
            className="absolute -right-[1px] -top-[25px] cursor-pointer rounded-none rounded-t-lg bg-primary px-2.5 py-1 text-xs font-bold !text-white"
            onClick={handleDeleteElement}
          >
            <Trash size={16} />
          </div>
        )}
    </div>
  );
};

export default TextComponent;
