import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import RougeButton from "../../../components/RougeButton";
import CreateEventPage from "../../../components/CreateEventPage";

export default function AddEventPage() {
  const [isCreateActive, setIsCreateActive] = useState(false);
  const [events, setEvents] = useState(null);

  const router = useRouter();

  const toggleCreateEvent = () => {
    setIsCreateActive(!isCreateActive);
  };

  const getAllEvents = async () => {
    const res = await fetch(
      "https://h6yb5bsx6a.execute-api.eu-north-1.amazonaws.com/rouge/admin",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "getAllTickets",
          eventId: "event",
        }),
      }
    );

    const data = await res.json();

    const allEvents = data.tickets;

    const visibleEvents = allEvents.filter((event) => !event.deleted);

    setEvents(visibleEvents);
  };

  console.log("These are all events: ", events);

  useEffect(() => {
    getAllEvents();
  }, []);

  return (
    <>
      <div className="min-h-screen">
        {isCreateActive ? (
          <CreateEventPage toggleActive={toggleCreateEvent} />
        ) : (
          <div>
            {" "}
            <h1 className="md:text-5xl text-4xl font-bold text-neutral-800 pl-4 mt-12 mb-6">
              Events och biljetter
            </h1>
            <p className="text-neutral-700 pl-4 text-xl mb-6">
              Välj ett event från listan för att göra ändringar
            </p>
            <div>
              {events
                ? events.map((event, index) => (
                    <div
                      onClick={() =>
                        router.push(`/admin/create-event/event/${event.sk}`)
                      }
                      key={index}
                      className={`${
                        index % 2 == 0 ? "bg-neutral-50" : "bg-neutral-100"
                      } flex py-4 px-6 gap-6`}
                    >
                      <div className="relative w-[100px] h-[100px] rounded-xl overflow-clip">
                        <Image
                          alt="Bild på event"
                          src={event.image}
                          layout="fill"
                          className="object-cover"
                        />
                      </div>
                      <div className="">
                        <p className="text-2xl font-semibold">
                          {event.eventName}
                        </p>
                        <p className="text-lg italic">{event.date}</p>
                      </div>
                    </div>
                  ))
                : null}
            </div>
            <div className="mt-8 px-4">
              <RougeButton
                type="main"
                text="Skapa event"
                action={toggleCreateEvent}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
