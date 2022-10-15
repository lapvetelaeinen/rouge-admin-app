import axios from "axios";
import { useState, useEffect, useRef } from "react";
import Dots from "./svg-components/Dots";
import Pen from "./svg-components/Pen";
import Plus from "./svg-components/Plus";
import Trash from "./svg-components/Trash";

export default function TicketCard({ ticket, toggle, setSelectedTicketClass, setShowStairsModal, setSelectedStairTicket, sales }) {
  const [showSettings, setShowSettings] = useState(false);
  const [salesInfo, setSalesInfo] = useState(null);

  let menuRef = useRef();

  useEffect(() => {
    sales.forEach((el) => {
      if(el.ticketClass === ticket.ticketClass){
        setSalesInfo(el);
      }
    });


    let handler = (event) => {
      if (!menuRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  const handleTrash = () => {
    setShowSettings(false);
    toggle();
  };

  const handleDotClick = () => {
    setShowSettings(true);
    setSelectedTicketClass(ticket.ticketClass);
  };

  const handleStairsClick = () => {
    setShowStairsModal();
    setSelectedStairTicket(ticket);
  };

  return (
    <div
      key={ticket.eventName}
      className="bg-neutral-100 p-5 rounded-md shadow-lg mt-4 text-lg flex justify-between"
    >
      <div>
        <p className="text-xl">{ticket.ticketClass}</p>
        {salesInfo ? (
          <>
            <p>Pris: {ticket.price} SEK</p>
            <p>
              Försäljning: {salesInfo.soldTickets} st (
              {salesInfo.revenue} SEK)
            </p>
            {/* <p>
              Biljetter kvar: {salesInfo[0].maxAmount - salesInfo[0].sold}/
              {salesInfo[0].maxAmount}
            </p> */}
          </>
        ) : null}
      </div>
      <div>
        <div
          ref={menuRef}
          className={`${
            !showSettings && "hidden"
          } bg-violet-200 text-sm shadow-2xl flex flex-col`}
        >
          {/* <div
            className="settings-box flex justify-between bg-neutral-300 p-4"
            onClick={() => console.log("yiha")}
          >
            <p className="settings-box text-neutral-700">Ändra</p>
            <Pen
              width={15}
              height={15}
              fill="#404040"
              className="settings-box"
            />
          </div> */}
          <div
            className="settings-box flex justify-between gap-2 bg-red-200 p-4"
            onClick={() => handleTrash()}
          >
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
            fill="#d57187"
            onClick={() => handleDotClick()}
            className={showSettings && "hidden"}
          />


        <div className={`${showSettings ? "hidden" : ""} bg-neutral-300 p-2 rounded-xl shadow-xl`} onClick={() => handleStairsClick()}>
          <div className="flex">
            <div className="  border-black w-3 h-1"></div>
            <div className="border-r-4 border-black w-2 h-1"></div>
          </div>
          <div className="flex">
            <div className="border-b-4 border-r-4 border-black w-3 h-3"></div>
            <div className="border-t-4 border-black w-2 h-3"></div>
          </div>
          </div>
      </div>
    </div>
  );
}
