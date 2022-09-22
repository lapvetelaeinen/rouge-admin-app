import useSWR from "swr";
import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { SelectedEventContext } from "../contexts/SelectedEventContext";
import { useContext } from "react";

const EventListTile = ({ event }) => {
  const router = useRouter();
  const { setSelectedEvent } = useContext(SelectedEventContext);
  const BUCKET_URL = "https://rouge-event-images.s3.eu-west-2.amazonaws.com/";
  const eventImage = BUCKET_URL + event.image;

  return (
    <div className="w-full px-2" onClick={() => router.push(`/admin/tickets/single-ticket/${event.eventName}`)}>
      <div className="bg-neutral-100 p-2 flex rounded-lg shadow-lg">
        <Image
          src={eventImage}
          width={100}
          height={100}
          alt=""
          className="rounded-md"
        />
        <div className="flex flex-col text-md justify-center pl-5">
          <p>{event.eventName}</p>
          <p>{event.eventDate}</p>
          <p>126 biljetter sålda</p>
        </div>
      </div>
    </div>
  );
};
export default EventListTile;
