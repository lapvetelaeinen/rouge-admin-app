import { useState, useEffect, useRef } from "react";
import Dots from "./svg-components/Dots";
import Pen from "./svg-components/Pen";
import Trash from "./svg-components/Trash";

export default function TicketCard({ ticket }) {
  const [showSettings, setShowSettings] = useState(false);

  let menuRef = useRef();


  useEffect(() => {
    let handler = (event) => {
      if (!menuRef.current.contains(event.target)){
        setShowSettings(false);
      }
    }

    document.addEventListener('mousedown', handler);

    return () => {
      document.removeEventListener('mousedown', handler);
    }
  });
  
  return (
    <div 
      key={ticket.eventName}
      className="bg-violet-300 p-5 rounded-md shadow-lg mt-4 text-lg flex justify-between"
    >
      <div>
        <p className="text-xl">{ticket.ticketClass}</p>
        <p>Pris: 10 SEK</p>
        <p>Försäljning: 213 st (2130 SEK)</p>
        <p>Biljetter kvar: 587/800</p>
      </div>
      <div>

     
          <div ref={menuRef} className={`${!showSettings && 'hidden'} bg-violet-200 text-sm shadow-2xl flex flex-col`}>
            <div className="settings-box flex justify-between bg-violet-200 p-4" onClick={() => console.log('yiha')}>

            <p className="settings-box text-neutral-700">Ändra </p>
            <Pen
            width={15}
            height={15}
            fill="#404040"
            className="settings-box"
          />
            </div>
            <div className="settings-box flex justify-between gap-2 bg-red-200 p-4">

            <p className="settings-box text-neutral-500">Ta bort</p>
            <Trash
            width={15}
            height={15}
            fill="#f87171"
            onClick={() => console.log("hello")}
            className="mt-1 settings-box"
          />
            </div>
          </div>
          <Dots
        width={35}
        height={35}
        fill="#ddd6fe"
        onClick={() => setShowSettings(true)}
        className={showSettings && 'hidden'}
      />
      </div>
    </div>
  );
}
