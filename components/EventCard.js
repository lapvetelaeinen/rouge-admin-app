import { useRouter } from "next/router.js";
import React, { useState, useEffect } from "react";
import Image from "next/image";

function EventCard({ event }) {
  const router = useRouter();
  //   const [eventImage, setEventImage] = useState();

  const BUCKET_URL = "https://rouge-event-images.s3.eu-west-2.amazonaws.com/";
  const eventImage = BUCKET_URL + event.image;

  //   useEffect(() => {
  //     async function getImageFromStorage() {
  //       try {
  //         const signedURL = await Storage.get(post.image); // get key from Storage.list
  //         console.log("Found Image:", signedURL);
  //         // @ts-ignore
  //         setPostImage(signedURL);
  //       } catch (error) {
  //         console.log("No image found.");
  //       }
  //     }

  //     getImageFromStorage();
  //   }, []);

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div className="pl-4" onClick={() => router.push(`/post/${post.id}`)}>
      <div className="relative drop-shadow-xl">
        {event.image && eventImage && (
          <Image
            src={eventImage}
            alt=""
            height={400}
            width={400}
            className="rounded-md"
            priority
          />
        )}
        <div className="absolute bottom-8 w-full bg-violet-200 p-2 flex justify-between px-3">
          <div className="text-neutral-900">
            <h2 className="font-appareo text-2xl">{event.title}</h2>
            <p className="font-appareo">{event.date}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
