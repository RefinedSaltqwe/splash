"use client";
import GlobalModal from "@/components/drawer/GlobalModal";
import { type LaborTrackingWithUsers } from "@/types/prisma";
import { type EventSourceInput } from "@fullcalendar/core/index.js";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { type LaborTracking, type User } from "@prisma/client";
import { AlertTriangle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { v4 } from "uuid";
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState<LaborTracking>({
    userId: "",
    title: "",
    agencyId,
    location: "",
    description: "",
    start: "",
    end: "",
    allDay: false,
    id: v4(),
  });

  useEffect(() => {
    console.log(allEvents);
  }, [allEvents]);

  useEffect(() => {
    const draggableEl = document.getElementById("draggable-el");
    if (draggableEl) {
      new Draggable(draggableEl, {
        itemSelector: ".fc-event",
        eventData: function (eventEl) {
          const title = eventEl.getAttribute("title");
          const id = eventEl.getAttribute("data");
          const start = eventEl.getAttribute("start");
          return { title, id, start };
        },
      });
    }
  }, []);

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

  // function addEvent(data: DropArg) {
  //   console.log("==> ", data.draggedEl.attributes[1]?.value);
  //   const event = {
  //     ...newEvent,
  //     start: data.date.toISOString(),
  //     end: "",
  //     userId: data.draggedEl.attributes[1]?.value.split("=")[1] ?? "",
  //     title: data.draggedEl.innerText,
  //     allDay: data.allDay,
  //     id: v4(),
  //   };
  //   setAllEvents([...allEvents, event]);
  // }

  function handleDeleteModal(data: { event: { id: string } }) {
    setShowDeleteModal(true);
    setIdToDelete(data.event.id);
  }

  function handleDelete() {
    setAllEvents(allEvents.filter((event) => event.id !== idToDelete));
    setShowDeleteModal(false);
    setIdToDelete(null);
  }

  function handleCloseModal() {
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
    setShowDeleteModal(false);
    setIdToDelete(null);
  }

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
              customButtons={{
                addEventButton: {
                  text: "Add event",
                  click: () => {
                    // setAllEvents((prev) => [
                    //   ...prev,
                    //   {
                    //     id: v4(),
                    //     title: "event",
                    //     start: new Date().toISOString(),
                    //     end: new Date().toISOString(),
                    //     allDay: true,
                    //     location
                    //   },
                    // ]);
                  },
                },
              }}
              events={allEvents as EventSourceInput}
              nowIndicator={true}
              editable={true}
              droppable={true}
              selectable={true}
              selectMirror={true}
              dateClick={handleDateClick}
              // drop={(data) => addEvent(data)}
              eventClick={(data) => handleDeleteModal(data)}
              eventChange={(data) => {
                setAllEvents((prev) =>
                  prev.map((event) => {
                    if (event.id === data.event._def.publicId) {
                      return {
                        ...event,
                        id: event.id,
                        allDay: data.event._def.allDay,
                        start:
                          data.event._instance?.range.start.toISOString() ?? "",
                        end:
                          data.event._instance?.range.end.toISOString() ?? "",
                        title: data.event._def.title,
                      };
                    }
                    return event;
                  }),
                );
              }}
              //   eventsSet={(data) => console.log("Data: ", data)}
              //   eventAdd={function () {}}
              //   eventRemove={function () {}}
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
            newEvent={newEvent}
          />
        </GlobalModal>

        <GlobalModal
          isOpen={showDeleteModal}
          setIsOpen={setShowDeleteModal}
          title="Delete Event"
        >
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div
                className="mx-auto flex h-12 w-12 flex-shrink-0 items-center 
                      justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
              >
                <AlertTriangle
                  className="h-6 w-6 text-red-600"
                  aria-hidden="true"
                />
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete this event?
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm 
                      font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
              onClick={handleDelete}
            >
              Delete
            </button>
            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 
                      shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              onClick={handleCloseModal}
            >
              Cancel
            </button>
          </div>
        </GlobalModal>
      </div>
    </div>
  );
};
export default ClientData;
