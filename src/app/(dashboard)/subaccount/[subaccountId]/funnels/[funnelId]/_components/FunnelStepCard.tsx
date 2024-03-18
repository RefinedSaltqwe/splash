/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Card, CardContent } from "@/components/ui/card";
import { type FunnelPage } from "@prisma/client";
import { ArrowDown, Mail } from "lucide-react";
import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { createPortal } from "react-dom";

type Props = {
  funnelPage: FunnelPage;
  index: number;
  activePage: boolean;
};

const FunnelStepCard = ({ activePage, funnelPage, index }: Props) => {
  const portal = document.getElementById("blur-page");

  return (
    <Draggable draggableId={funnelPage.id.toString()} index={index}>
      {(provided, snapshot) => {
        if (snapshot.isDragging) {
          const offset = { x: 0 };
          //@ts-expect-error
          const x = provided.draggableProps.style?.left - offset.x;
          //@ts-expect-error
          provided.draggableProps.style = {
            ...provided.draggableProps.style,
            left: x,
          };
        }
        const component = (
          <Card
            className="relative my-2 cursor-grab p-0"
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <CardContent className="flex flex-row items-center gap-4 p-0">
              <div className="flex h-14 w-14 items-center justify-center bg-muted">
                <Mail />
                <ArrowDown
                  size={18}
                  className="absolute -bottom-2 text-primary"
                />
              </div>
              {funnelPage.name}
            </CardContent>
            {activePage && (
              <div className="absolute right-2 top-2 h-3 w-3 rounded-full bg-primary" />
            )}
          </Card>
        );
        if (!portal) return component;
        if (snapshot.isDragging) {
          return createPortal(component, portal);
        }
        return component;
      }}
    </Draggable>
  );
};

export default FunnelStepCard;
