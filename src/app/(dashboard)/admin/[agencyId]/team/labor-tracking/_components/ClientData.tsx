"use client";
import GlobalModal from "@/components/drawer/GlobalModal";
import { type LaborTrackingWithUsers } from "@/types/prisma";
import { type EventSourceInput } from "@fullcalendar/core/index.js";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, {
  Draggable,
  type DropArg,
} from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { type LaborTracking, type User } from "@prisma/client";
import { AlertTriangle, CheckIcon } from "lucide-react";
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
    setNewEvent({
      ...newEvent,
      agencyId,

      start: arg.date.toLocaleString(),
      allDay: arg.allDay,
      id: new Date().getTime().toString(),
    });
    setShowModal(true);
  }

  function addEvent(data: DropArg) {
    const event = {
      ...newEvent,
      start: data.date.toISOString(),
      end: "",
      title: data.draggedEl.innerText,
      allDay: data.allDay,
      id: new Date().getTime().toString(),
    };
    setAllEvents([...allEvents, event]);
  }

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
      id: v4(),
    });
    setShowDeleteModal(false);
    setIdToDelete(null);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNewEvent({
      ...newEvent,
      userId: e.target.value,
    });
  };

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAllEvents([...allEvents, newEvent]);
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
      id: v4(),
    });
  }

  return (
    <div className="flex w-full flex-col">
      <div className="flex min-h-screen flex-col items-center justify-between">
        <div className="grid w-full grid-cols-10 gap-5">
          <div className="col-span-9">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
              timeZone="CST"
              headerToolbar={{
                left: "prev,next today addEventButton",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              // customButtons={{
              //   addEventButton: {
              //     text: "Add event",
              //     click: () => {
              //       setAllEvents((prev) => [
              //         ...prev,
              //         {
              //           id: v4(),
              //           title: "event",
              //           start: new Date().toISOString(),
              //           end: new Date().toISOString(),
              //           allDay: true,
              //           location
              //         },
              //       ]);
              //     },
              //   },
              // }}
              events={allEvents as EventSourceInput}
              nowIndicator={true}
              editable={true}
              droppable={true}
              selectable={true}
              selectMirror={true}
              dateClick={handleDateClick}
              drop={(data) => addEvent(data)}
              eventClick={(data) => handleDeleteModal(data)}
              eventChange={(data) => {
                console.log("ChangeEVent", data);
                setAllEvents((prev) =>
                  prev.map((event) => {
                    if (event.id === data.event._def.publicId) {
                      return {
                        ...event,
                        id: event.id,
                        allDay: data.event._def.allDay,
                        start:
                          data.event._instance?.range.start.toString() ?? "",
                        end: data.event._instance?.range.end.toString() ?? "",
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
          <div
            id="draggable-el"
            className="col-span-1 mt-16 rounded-md border-2 bg-violet-50 p-2 lg:h-1/2"
          >
            <h1 className="text-center text-lg font-bold">Drag Event</h1>
            {employees.map((employee) => (
              <div
                className="fc-event m-2 ml-auto w-full rounded-md border-2 bg-white p-1 text-center"
                title={employee.name}
                key={employee.id}
              >
                {employee.name}
              </div>
            ))}
          </div>
        </div>

        <GlobalModal
          isOpen={showModal}
          setIsOpen={setShowModal}
          title="Add schedule"
        >
          <div>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckIcon
                className="h-6 w-6 text-green-600"
                aria-hidden="true"
              />
            </div>
            <LaborTrackingForm setIsOpen={setShowModal} agencyId={agencyId} />
            {/* <div className="mt-3 text-center sm:mt-5">
              <form action="submit" onSubmit={handleSubmit}>
                <div className="mt-2">
                  <input
                    type="text"
                    name="title"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 
                            shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
                            focus:ring-2 
                            focus:ring-inset focus:ring-violet-600 
                            sm:text-sm sm:leading-6"
                    value={newEvent.userId}
                    onChange={(e) => handleChange(e)}
                    placeholder="Title"
                  />
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="submit"
                    className="inline-flex w-full justify-center rounded-md bg-violet-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 disabled:opacity-25 sm:col-start-2"
                    disabled={newEvent.userId === ""}
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div> */}
          </div>
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
