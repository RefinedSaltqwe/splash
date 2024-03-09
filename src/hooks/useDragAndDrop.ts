import { updateLanesOrder, updateTicketsOrder } from "@/server/queries";
import { type LaneDetail } from "@/types/stripe";
import { type Dispatch, type SetStateAction } from "react";
import { type DropResult } from "@hello-pangea/dnd";

const useDragAndDrop = (
  allLanes: LaneDetail[] | [],
  setAllLanes: Dispatch<SetStateAction<LaneDetail[] | []>>,
) => {
  // Reorder by index
  function reorder<T>(list: T[], startIndex: number, endIndex: number) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed!);

    return result;
  }

  const onDragEnd = async (dropResult: DropResult) => {
    const { destination, source, type } = dropResult;
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    switch (type) {
      case "lane": {
        const newLanes = reorder(allLanes, source.index, destination.index).map(
          (item, index) => ({ ...item, order: index }),
        );
        setAllLanes(newLanes);
        await updateLanesOrder(newLanes);
      }

      case "ticket": {
        const newLanes = [...allLanes];
        const originLane = newLanes.find(
          (lane) => lane.id === source.droppableId,
        );
        const destinationLane = newLanes.find(
          (lane) => lane.id === destination.droppableId,
        );

        if (!originLane || !destinationLane) {
          return;
        }

        if (source.droppableId === destination.droppableId) {
          const newOrderedTickets = reorder(
            originLane.Tickets,
            source.index,
            destination.index,
          ).map((item, index) => ({ ...item, order: index }));
          originLane.Tickets = newOrderedTickets;
          setAllLanes(newLanes);
          await updateTicketsOrder(newOrderedTickets);
        } else {
          const [currentTicket] = originLane.Tickets.splice(source.index, 1);

          originLane.Tickets.forEach((ticket, idx) => {
            ticket.order = idx;
          });

          destinationLane.Tickets.splice(destination.index, 0, {
            id: currentTicket?.id ?? "",
            name: currentTicket?.name ?? "",
            createdAt: currentTicket?.createdAt ?? new Date(),
            updatedAt: currentTicket?.updatedAt ?? new Date(),
            order: currentTicket?.order ?? 0,
            value: currentTicket?.value ?? null,
            description: currentTicket?.description ?? "",
            customerId: currentTicket?.customerId ?? "",
            assignedUserId: currentTicket?.assignedUserId ?? "",
            Tags: currentTicket?.Tags ?? [],
            Assigned: currentTicket?.Assigned ?? null,
            Customer: currentTicket?.Customer ?? null,
            ...currentTicket,
            laneId: destination.droppableId,
          });

          destinationLane.Tickets.forEach((ticket, idx) => {
            ticket.order = idx;
          });
          setAllLanes(newLanes);
          await updateTicketsOrder([
            ...destinationLane.Tickets,
            ...originLane.Tickets,
          ]);
        }
      }
    }
  };
  return { onDragEnd };
};

export default useDragAndDrop;
