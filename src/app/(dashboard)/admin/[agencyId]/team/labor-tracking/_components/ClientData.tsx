"use client";
import GlobalModal from "@/components/drawer/GlobalModal";
import { useAction } from "@/hooks/useAction";
import { upsertSchedule } from "@/server/actions/upsert-schedule";
import { type LaborTrackingWithUsers } from "@/types/prisma";
import { type EventSourceInput } from "@fullcalendar/core/index.js";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { type LaborTracking, type User } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import LaborTrackingForm from "./LaborTrackingForm";

type ClientDataProps = {
  events: LaborTrackingWithUsers[];
  employees: User[];
  agencyId: string;
};

const ClientData: React.FC<ClientDataProps> = ({
  events,
  employees,
  agencyId,
}) => {
  const [allEvents, setAllEvents] = useState<LaborTracking[]>(events);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState<LaborTracking>({
    userId: "",
    title: "",
    agencyId,
    location: "",
    description: "",
    start: "",
    end: "",
    allDay: false,
    id: "",
  });

  useEffect(() => {
    console.log(allEvents);
  }, [allEvents]);

  const { execute: executeUpsertSchedule } = useAction(upsertSchedule, {
    onSuccess: (data) => {
      setAllEvents((prev) =>
        prev.map((event) => {
          if (event.id === data.id) {
            return {
              ...event,
              allDay: data.allDay,
              start: data.start,
              end: data.end,
            };
          }
          return event;
        }),
      );
    },
    onError: (error) => {
      toast.error(error);
    },
    onComplete: () => {
      toast("Saved");
    },
  });

  function handleDateClick(arg: { date: Date; allDay: boolean }) {
    setNewEvent((prev) => ({
      ...prev,
      agencyId,
      end: "",
      start: arg.date.toISOString(),
      allDay: arg.allDay,
    }));
    setShowModal(true);
  }

  function handleUpdateModal(data: { event: { id: string } }) {
    const payload = allEvents.filter((event) => event.id === data.event.id);
    setNewEvent(payload[0]!);
    setShowModal(true);
  }

  useEffect(() => {
    if (!showModal) {
      setShowModal(false);
      setNewEvent({
        userId: "",
        title: "",
        agencyId,
        location: "",
        description: "",
        start: "",
        end: "",
        allDay: false,
        id: "",
      });
    }
  }, [showModal]);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-[90vh] flex-col items-center justify-between">
        <div className="grid w-full grid-cols-10 gap-5">
          <div className="col-span-full">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
              timeZone="CST"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              events={allEvents as EventSourceInput}
              nowIndicator={true}
              editable={true}
              droppable={true}
              selectable={true}
              selectMirror={true}
              dateClick={handleDateClick}
              eventClick={(data) => handleUpdateModal(data)}
              eventChange={(data) => {
                void executeUpsertSchedule({
                  id: data.event._def.publicId,
                  allDay: data.event._def.allDay,
                  start: data.event._instance?.range.start.toISOString() ?? "",
                  end: data.event._instance?.range.end.toISOString() ?? "",
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  description: data.event._def.extendedProps.description!,
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  userId: data.event._def.extendedProps.userId!,
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  agencyId: data.event._def.extendedProps.agencyId!,
                  title: data.event._def.title,
                });
              }}
            />
          </div>
        </div>

        <GlobalModal
          isOpen={showModal}
          setIsOpen={setShowModal}
          title="Add schedule"
        >
          <LaborTrackingForm
            setIsOpen={setShowModal}
            agencyId={agencyId}
            allTeamMembers={employees}
            setAllEvents={setAllEvents}
            payload={newEvent}
          />
        </GlobalModal>
      </div>
    </div>
  );
};
export default ClientData;
