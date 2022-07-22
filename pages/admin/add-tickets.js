import { useRouter } from "next/router";
import React, { useState } from "react";
import { set, useForm } from "react-hook-form";
import axios from "axios";
import useSWR from "swr";
import EventListTile from "../../components/EventListTile";
import Times from "../../components/svg-components/Times";
import { SelectedEventContext } from "../../contexts/SelectedEventContext";
import { useContext } from "react";

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function AddTickets() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const { selectedEvent } = useContext(SelectedEventContext);

  const [value, setValue] = useState("fruit");

  const handleChange = (event) => {
    setValue(event.target.value);
    console.log(event.target.value);
  };

  const fetched = useSWR("/api/events", fetcher);

  const allEvents = fetched.data;

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const addTicket = async (params) => {
    await axios.post("/api/addticket", params);

    await axios({
      method: "post",
      url: "https://rouge-frontend.vercel.app/api/revalidate-event?secret=gkmn12714",
      headers: {},
      data: {
        slugToRevalidate: selectedEvent.eventId, // This is the body part
      },
    });
  };

  const onSubmit = async (data) => {
    console.log(data);

    const newTicket = [
      {
        class: data.ticketclass,
        price: data.price,
        amount: data.amount,
        eventId: selectedEvent.eventId,
      },
    ];

    if (data) {
      const createNewTicketInput = {
        ticket: newTicket,
      };

      addTicket(createNewTicketInput);

      // router.push(`/admin/dashboard`);
    } else {
      return;
    }
  };

  return (
    <div className="min-h-screen w-full bg-orange-100">
      <div className="">
        {showModal ? (
          <div className="bg-neutral-800 absolute z-50 h-full w-full flex justify-center items-start bg-opacity-80">
            <div className="bg-neutral-200 w-full min-h-[700px] m-4 rounded-3xl">
              <div className="flex flex-col">
                <div className="flex justify-between p-1 mb-8 items-center">
                  <p className="text-xl pl-2 pt-2">{selectedEvent.title}</p>
                  <Times
                    width={50}
                    height={50}
                    fill="#f57971"
                    onClick={() => setShowModal(!showModal)}
                  />
                </div>
                <div className="bg-neutral-200 m-2 rounded-lg">
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    autoComplete="off"
                    className="flex flex-col gap-3"
                  >
                    <input
                      type="text"
                      placeholder="Biljettklass"
                      name="ticketclass"
                      {...register("ticketclass")}
                      className="p-4 bg-violet-300 placeholder-neutral-700 text-neutral-900 rounded-md shadow-sm"
                    />

                    <input
                      type="number"
                      placeholder="Pris"
                      name="price"
                      {...register("price")}
                      className="p-4 bg-violet-300 placeholder-neutral-700 text-neutral-900 rounded-md shadow-sm"
                    />

                    <input
                      type="number"
                      placeholder="Antal"
                      name="amount"
                      {...register("amount")}
                      className="p-4 bg-violet-300 placeholder-neutral-700 text-neutral-900 rounded-md shadow-sm"
                    />

                    <input
                      type="submit"
                      className="p-4 bg-violet-600 placeholder-neutral-700 text-neutral-300 rounded-md shadow-sm"
                      value="Skapa"
                    />
                  </form>
                  <button onClick={() => console.log(selectedEvent.eventId)}>
                    Test
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
      <h1 className="pb-8 text-4xl text-violet-800 pl-2">Dina event</h1>
      <div className="flex flex-col gap-4">
        {allEvents
          ? allEvents.map((event) => (
              <div key={event.eventId} onClick={() => setShowModal(!showModal)}>
                <EventListTile
                  key={event.eventId}
                  id={event.eventId}
                  event={event}
                />
              </div>
            ))
          : null}
      </div>
    </div>
  );
}
