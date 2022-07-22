import { createContext, useState } from "react";

const SelectedEventContext = createContext();

function SelectedEventProvider({ children }) {
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <SelectedEventContext.Provider
      value={{
        selectedEvent,
        setSelectedEvent,
      }}
    >
      {children}
    </SelectedEventContext.Provider>
  );
}

export { SelectedEventProvider, SelectedEventContext };
