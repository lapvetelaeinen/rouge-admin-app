import { useState } from "react";
import RougeButton from "../../../components/RougeButton";
import CreateEventPage from "../../../components/CreateEventPage";

export default function AddEventPage() {
  const [isCreateActive, setIsCreateActive] = useState(false);

  const toggleCreateEvent = () => {
    setIsCreateActive(!isCreateActive);
  };

  return (
    <>
      <div className="min-h-screen">
        {isCreateActive ? (
          <CreateEventPage toggleActive={toggleCreateEvent} />
        ) : (
          <div>
            {" "}
            <h1 className="md:text-5xl text-4xl font-bold text-neutral-800">
              Events
            </h1>
            <RougeButton
              type="main"
              text="Skapa event"
              action={toggleCreateEvent}
            />
            <p className="text-neutral-700">
              Välj ett event från listan för att göra ändringar
            </p>
          </div>
        )}
      </div>
    </>
  );
}
