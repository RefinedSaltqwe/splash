import { reorder } from "@/lib/utils";
import { upsertFunnelPages } from "@/server/queries";
import { type DragStart, type DropResult } from "@hello-pangea/dnd";
import { type FunnelPage } from "@prisma/client";
import { type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";

const useDragAndDropFunnels = (
  subaccountId: string,
  funnelId: string,
  pagesState: FunnelPage[] | [],
  setPagesState: Dispatch<SetStateAction<FunnelPage[] | []>>,
) => {
  const onDragStart = (event: DragStart) => {
    //current chosen page
    const { draggableId } = event;
    const value = pagesState.find((page) => page.id === draggableId);
  };

  const onDragEnd = async (dropResult: DropResult) => {
    const { destination, source } = dropResult;

    //no destination or same position
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }
    //change state
    const newPageOrder = reorder(
      pagesState,
      source.index,
      destination.index,
    ).map((item, index) => ({ ...item, order: index }));

    setPagesState(newPageOrder);
    const response = await upsertFunnelPages(
      subaccountId,
      newPageOrder,
      funnelId,
    );
    if (response)
      toast.success("Success", {
        description: "Saved page order",
      });
  };
  return { onDragEnd, onDragStart };
};

export default useDragAndDropFunnels;
