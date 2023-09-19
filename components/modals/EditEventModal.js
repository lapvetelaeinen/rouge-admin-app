import BackButton from "../BackButton";
import Image from "next/image";
import DeleteEventModal from "./DeleteEventModal";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Times from "../svg-components/Times";
import RougeButton from "../RougeButton";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

export default function EditEventModal({ toggleEdit, event, saveChanges }) {
  const [selectedDate, setSelectedDate] = useState(new Date(event.date));
  const [isAskToDeleteActive, setIsAskToDeletActive] = useState(false);

  const router = useRouter();

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const payload = {
      type: "editEvent",
      event: {
        pk: "event",
        sk: event.sk,
        date: selectedDate,
        eventName: data.name,
        image: event.image,
        info: data.info,
        visible: event.visible,
      },
    };

    console.log("Payload: ", payload);

    const lambdaResponse = await fetch("/api/aws", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const msg = await lambdaResponse.json();

    console.log("Message: ", msg);

    saveChanges();
    toggleEdit();
  };

  const deleteEvent = async () => {
    console.log("deleting event...");
    const payload = {
      type: "deleteEvent",
      event: {
        pk: "event",
        eventId: event.sk,
      },
    };

    const lambdaResponse = await fetch("/api/aws", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const msg = await lambdaResponse.json();

    router.push("/admin/create-event");
  };

  const toggleAskToDelete = () => {
    setIsAskToDeletActive(!isAskToDeleteActive);
  };

  return (
    <>
      <div className="relative flex flex-col gap-4 pb-8">
        <DeleteEventModal
          toggleAskToDelete={toggleAskToDelete}
          deleteEvent={deleteEvent}
          isAskToDeleteActive={isAskToDeleteActive}
          eventId={event.sk}
        />
        <button onClick={toggleEdit}>
          <div className="bg-neutral-50 absolute top-6 right-0 flex justify-center items-center p-3 rounded-xl drop-shadow-2xl">
            <Times width="35px" height="35px" fill="#7e22ce" className="" />
          </div>
        </button>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 mt-[80px]"
        >
          <input
            autoComplete="off"
            className="py-4 pl-4 text-2xl drop-shadow-md"
            type="text"
            placeholder="Titel"
            defaultValue={event.eventName}
            {...register("name", { required: true, maxLength: 80 })}
          />
          <textarea
            rows={5}
            className="py-4 pl-4 text-2xl drop-shadow-md"
            placeholder="Info"
            defaultValue={event.info}
            {...register("info")}
          />

          <DatePicker
            className="bg-purple-100 rounded-md p-4 text-neutral-700 text-xl  drop-shadow-md w-full mb-6"
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
          />

          <input
            type="submit"
            value="Spara ändringar"
            className="bg-purple-500 text-white drop-shadow-md py-5 text-2xl rounded-full"
          />
        </form>

        <RougeButton
          type="secondary"
          text="Radera event"
          action={toggleAskToDelete}
        />
      </div>
    </>
  );
}
