"use client";
import {
  useEditor,
  type EditorElement,
} from "@/components/providers/EditorProvider";
import { Badge } from "@/components/ui/badge";
import { defaultStyles, type EditorBtns } from "@/constants/defaultsValues";
import { cn } from "@/lib/utils";
import { Trash } from "lucide-react";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Recursive from "./Recursive";
import { useDivSpacer } from "@/stores/funnelDivSpacer";

type ContainerProps = { element: EditorElement; index: number; level: number };

const Container: React.FC<ContainerProps> = ({ element, index, level }) => {
  const { id, content, name, styles, type } = element;
  const { dispatch, state } = useEditor();
  const [isFocus, setIsFocus] = useState(false);
  const onOpen = useDivSpacer((state) => state.onOpen);
  const onClose = useDivSpacer((state) => state.onClose);
  const isShow = useDivSpacer((state) => state.isShow);

  const handleOnDrop = (e: React.DragEvent) => {
    e.stopPropagation();
    const componentType = e.dataTransfer.getData("componentType") as EditorBtns;

    switch (componentType) {
      case "hero1":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: {
                hero1: {
                  title: "Data to enrich your online business",
                  description:
                    "Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat aliqua.",
                  backgroundHref:
                    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2830&q=80&blend=111827&sat=-100&exp=15&blend-mode=multiply",
                  opacity: "opacity-100",
                  position: "center",
                  primaryButton: {
                    visible: true,
                    name: "Get started",
                    styles: {
                      color: "white",
                      backgroundColor: "#3b82f6",
                    },
                    href: "#",
                  },
                },
              },
              id: uuidv4(),
              name: "Hero 1",
              styles: {},
              type: "hero1",
            },
          },
        });
        break;
      case "text":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: { innerText: "Text Element" },
              id: uuidv4(),
              name: "Text",
              styles: {
                color: "black",
                ...defaultStyles,
              },
              type: "text",
            },
          },
        });
        break;
      case "link":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: {
                innerText: "Link Element",
                href: "#",
              },
              id: uuidv4(),
              name: "Link",
              styles: {
                color: "black",
                ...defaultStyles,
              },
              type: "link",
            },
          },
        });
        break;
      case "video":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: {
                src: "https://www.youtube.com/embed/A3l6YYkXzzg?si=zbcCeWcpq7Cwf8W1",
              },
              id: uuidv4(),
              name: "Video",
              styles: {},
              type: "video",
            },
          },
        });
        break;
      case "container":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: [],
              id: uuidv4(),
              name: "Container",
              styles: { ...defaultStyles },
              type: "container",
            },
          },
        });
        break;
      case "contactForm":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: [],
              id: uuidv4(),
              name: "Contact Form",
              styles: {},
              type: "contactForm",
            },
          },
        });
        break;
      case "paymentForm":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: [],
              id: uuidv4(),
              name: "Contact Form",
              styles: {},
              type: "paymentForm",
            },
          },
        });
        break;
      case "2Col":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: [
                {
                  content: [],
                  id: uuidv4(),
                  name: "Container",
                  styles: { ...defaultStyles, width: "100%" },
                  type: "container",
                },
                {
                  content: [],
                  id: uuidv4(),
                  name: "Container",
                  styles: { ...defaultStyles, width: "100%" },
                  type: "container",
                },
              ],
              id: uuidv4(),
              name: "Two Columns",
              styles: { ...defaultStyles, display: "flex" },
              type: "2Col",
            },
          },
        });
        break;
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragStart = (e: React.DragEvent, type: string) => {
    if (type === "__body") return;
    e.dataTransfer.setData("componentType", type);
  };

  const handleOnClickBody = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (index === 0 && level === 2) {
      onOpen();
    } else {
      onClose();
    }
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {
        elementDetails: element,
      },
    });
  };

  const handleDeleteElement = () => {
    onClose();
    dispatch({
      type: "DELETE_ELEMENT",
      payload: {
        elementDetails: element,
      },
    });
  };

  return (
    <div
      style={styles}
      className={cn(
        "group relative p-4 transition-all",
        {
          "scroll-focus": isFocus,
          "scroll-blur": !isFocus,

          "w-full max-w-full": type === "container" || type === "2Col",
          "h-fit": type === "container",
          "h-full": type === "__body",
          "splash-scroll splash-scroll-no-width overflow-x-auto":
            type === "__body",
          "flex flex-col md:!flex-row": type === "2Col",
          "!border-blue-500":
            state.editor.selectedElement.id === id &&
            !state.editor.liveMode &&
            state.editor.selectedElement.type !== "__body",
          "!border-4 !border-yellow-400":
            state.editor.selectedElement.id === id &&
            !state.editor.liveMode &&
            state.editor.selectedElement.type === "__body",
          "!border-solid":
            state.editor.selectedElement.id === id && !state.editor.liveMode,
          "border-[1px] border-dashed border-slate-300": !state.editor.liveMode,
        },
        // !state.editor.liveMode &&
        //   type !== "__body" &&
        //   index === 0 &&
        //   "mt-[5px]",
        !state.editor.liveMode && type === "__body" && "p-[5px] !pb-[300px]",
      )}
      onDrop={(e) => handleOnDrop(e)}
      onDragOver={handleDragOver}
      draggable={type !== "__body"}
      onClick={handleOnClickBody}
      onDragStart={(e) => handleDragStart(e, "container")}
      onMouseOver={() => {
        if (!isFocus) {
          setIsFocus(true);
        }
        return;
      }}
      onMouseLeave={() => {
        if (isFocus) {
          setIsFocus(false);
        }
        return;
      }}
    >
      {type === "__body" && !state.editor.liveMode && isShow && (
        <div className="z-0 flex h-2 w-full p-3" />
      )}
      <Badge
        className={cn(
          "absolute -left-[1px] -top-[23px] hidden rounded-none rounded-t-lg",
          {
            block:
              state.editor.selectedElement.id === element.id &&
              !state.editor.liveMode,
          },
        )}
      >
        {name}
      </Badge>

      {Array.isArray(content) &&
        content.map((childElement, idx) => (
          <Recursive
            key={childElement.id}
            element={childElement}
            index={idx}
            level={level + 1}
          />
        ))}

      {state.editor.selectedElement.id === element.id &&
        !state.editor.liveMode &&
        state.editor.selectedElement.type !== "__body" && (
          <div
            className="absolute -right-[1px] -top-[25px] cursor-pointer rounded-none rounded-t-lg bg-primary  px-2.5 py-1 text-xs font-bold "
            onClick={handleDeleteElement}
          >
            <Trash size={16} />
          </div>
        )}
    </div>
  );
};

export default Container;
