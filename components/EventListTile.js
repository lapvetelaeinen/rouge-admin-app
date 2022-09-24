import useSWR from "swr";
import React from "react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { SelectedEventContext } from "../contexts/SelectedEventContext";
import { useContext } from "react";
import Dots from "./svg-components/Dots";
import Trash from "./svg-components/Trash";
import Pen from "./svg-components/Pen";

const EventListTile = ({ event, toggle, setSelectedEvent }) => {
  const router = useRouter();
  const BUCKET_URL = "https://rouge-event-images.s3.eu-west-2.amazonaws.com/";
  const eventImage = BUCKET_URL + event.image;

  const [showSettings, setShowSettings] = useState(false);

  const handleDotClick = (e) => {
    e.stopPropagation();
    setShowSettings(true);
    setSelectedEvent(event);
  };

  const handleTrash = (e) => {
    e.stopPropagation();
    setShowSettings(false);
    toggle();
  };

  let menuRef = useRef();

  useEffect(() => {
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

  return (
    <div
      className="w-full px-2"
      onClick={() =>
        router.push(`/admin/tickets/single-ticket/${event.eventName}`)
      }
    >
      <div className="bg-neutral-100 p-2 flex justify-between rounded-lg shadow-lg">
        <div className="flex">
          <Image
            src={eventImage}
            width={100}
            height={100}
            alt=""
            className="rounded-md"
          />
          <div className="flex flex-col text-md justify-center pl-5 text-neutral-500">
            <p className="text-neutral-700">
              {event.eventName.split("_")[0].replace("-", " ").toUpperCase()}
            </p>
            <p>{event.eventDate}</p>
            <p>126 biljetter sålda</p>
          </div>
        </div>
        <div>
          <div
            ref={menuRef}
            className={`${
              !showSettings && "hidden"
            } bg-violet-200 text-sm shadow-2xl flex flex-col`}
          >
            <div
              className="settings-box flex justify-between gap-2 bg-red-200 p-4"
              onClick={(e) => handleTrash(e)}
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
            onClick={(e) => handleDotClick(e)}
            className={showSettings && "hidden"}
          />
        </div>
      </div>
    </div>
  );
};
export default EventListTile;
