import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
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

  const [inputValue, setInputValue] = useState("Ny biljettklass");
  const [isOldTicket, setIsOldTicket] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState("");

  const handleChange = (event) => {
    setInputValue(event.target.value);
    console.log(selectedEvent.tickets, inputValue);
    const found = selectedEvent.tickets.find(
      (ticket) => ticket.class == event.target.value
    );

    console.log(inputValue);

    if (found) {
      setSelectedTicket(found);
      setValue("ticketclass", found.class);
      setValue("price", found.price);
      setValue("amount", found.amount);
      setIsOldTicket(true);
    } else {
      setValue("ticketclass", "Biljettklass");
      setValue("price", "Pris");
      setValue("amount", "Antal");
      setIsOldTicket(false);
    }
  };

  const fetched = useSWR("/api/events", fetcher);

  const allEvents = fetched.data;

  const {
    setValue,
    reset,
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

  const updateTicket = async (updatedTicketsArr) => {
    await axios({
      method: "post",
      url: "/api/updateticket",
      headers: {},
      data: {
        eventId: selectedEvent.eventId,
        tickets: updatedTicketsArr,
      },
    });

    await axios({
      method: "post",
      url: "https://rouge-frontend.vercel.app/api/revalidate-event?secret=gkmn12714",
      headers: {},
      data: {
        slugToRevalidate: selectedEvent.eventId, // This is the body part
      },
    });
  };

  const handleClose = () => {
    setShowModal(false);
    setInputValue("Ny biljettklass");
    setValue("ticketclass", "Biljettklass");
    setValue("price", "Pris");
    setValue("amount", "Antal");
  };

  const onSubmit = async (data) => {
    console.log(data);
    let updatedTickets = [];

    if (isOldTicket) {
      selectedEvent.tickets.map((ticket) => {
        if (selectedTicket.class === ticket.class) {
          return;
        }
        updatedTickets.push(ticket);
      });

      const updatedTicket = {
        class: data.ticketclass,
        price: data.price,
        amount: data.amount,
      };

      updatedTickets.push(updatedTicket);

      console.log(updatedTickets);

      updateTicket(updatedTickets);
      reset();
      handleClose();

      return;
    }

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
      reset();
      handleClose();

      // router.push(`/admin/dashboard`);
    } else {
      return;
    }
  };

  return (
    <div className="min-h-screen w-full bg-orange-100">
      <div className="">
        {showModal ? (
          <div className="bg-neutral-800 absolute z-50 h-full w-full flex justify-center items-center mb-40 bg-opacity-80">
            <div className="bg-neutral-200 w-full min-h-[450px] m-4 rounded-3xl">
              <div className="flex flex-col">
                <div className="flex justify-between p-1 mb-8 items-center">
                  <p className="text-xl pl-2 pt-2">{selectedEvent.title}</p>
                  <Times
                    width={50}
                    height={50}
                    fill="#f57971"
                    onClick={() => handleClose()}
                  />
                </div>
                <select
                  value={inputValue}
                  onChange={handleChange}
                  className="m-2 p-2 bg-neutral-300 rounded-md text-neutral-500 shadow-sm"
                >
                  <option key="newTicket" value="Ny biljettklass">
                    Ny biljettklass
                  </option>
                  {selectedEvent.tickets.map((ticket) => (
                    <option key={ticket.class} value={ticket.ticketclass}>
                      {ticket.class}
                    </option>
                  ))}
                </select>
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
                    {inputValue === "Ny biljettklass" ? (
                      <input
                        type="submit"
                        className="p-4 bg-violet-600 placeholder-neutral-700 text-neutral-300 rounded-md shadow-sm"
                        value="Skapa"
                      />
                    ) : (
                      <input
                        type="submit"
                        className="p-4 bg-orange-300 placeholder-neutral-700 text-neutral-700 rounded-md shadow-sm"
                        value="Uppdatera"
                      />
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
      <h1 className="pb-8 text-4xl text-neutral-700 pl-2 pt-14 font-bold">
        Dina event
      </h1>
      <div className="flex flex-col gap-4 pt-5">
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
