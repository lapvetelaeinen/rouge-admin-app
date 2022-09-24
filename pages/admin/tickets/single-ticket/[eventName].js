import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import axios from "axios";
import Image from "next/image";
import Times from "../../../../components/svg-components/Times";
import TicketCard from "../../../../components/TicketCard";

export default function TicketsPage({ eventInfo }) {
  const router = useRouter();
  const [allTickets, setAllTickets] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTicketClass, setSelectedTicketClass] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  const BUCKET_URL = "https://rouge-event-images.s3.eu-west-2.amazonaws.com/";
  const imagePath = BUCKET_URL + eventInfo.image;

  const {
    reset,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = async (data) => {
    const params = {
      eventName: eventInfo.eventName,
      ticketClass: data.ticketClass,
      price: data.price,
      maxAmount: data.maxAmount,
    };

    if (data) {
      axios.post(
        "https://47yon8pxx3.execute-api.eu-west-2.amazonaws.com/rouge-api/create-ticket",
        params
      );
      reset();
    } else {
      return;
    }
    router.reload(window.location.pathname)

  };

  const deleteTicket = () => {
    const params = {
      eventName: eventInfo.eventName,
      ticketClass: selectedTicketClass
    }


    axios.post("https://47yon8pxx3.execute-api.eu-west-2.amazonaws.com/rouge-api/delete-ticket", params);


    router.reload(window.location.pathname)
    
  }

  useEffect(() => {
    if (!allTickets) {
      axios
        .get(
          `https://47yon8pxx3.execute-api.eu-west-2.amazonaws.com/rouge-api/get-tickets?eventName=${eventInfo.eventName}`
        )
        .then((res) => setAllTickets(res.data));
    }
    return;
  });

  return (
    <div className="min-h-screen bg-slate-800 relative md:px-28 md:py-10">
      {showModal ? (
        <div className="">
          <div
            className="bg-neutral-800 z-40 absolute h-full w-full flex justify-center items-center bg-opacity-80"
            onClick={() => setShowModal(false)}
          ></div>
          <div className="absolute bg-neutral-200 z-50 w-full min-h-[300px rounded-3xl p-4 mt-40">
            <div className="flex flex-col">
              <div className="flex justify-between p-1">
                <p></p>
                <Times
                  width={50}
                  height={50}
                  fill="#f57971"
                  onClick={() => setShowModal(!showModal)}
                />
              </div>
              <form
                onSubmit={handleSubmit(onSubmit)}
                autoComplete="off"
                className="flex flex-col gap-3"
              >
                <input
                  type="text"
                  placeholder="Biljettklass"
                  name="ticketClass"
                  {...register("ticketClass")}
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
                  name="maxAmount"
                  {...register("maxAmount")}
                  className="p-4 bg-violet-300 placeholder-neutral-700 text-neutral-900 rounded-md shadow-sm"
                />

                <input
                  type="submit"
                  className="p-4 bg-violet-600 placeholder-neutral-700 text-neutral-300 rounded-md shadow-sm"
                  value="Skapa"
                />
              </form>
            </div>
          </div>
        </div>
      ) : null}

{showDeleteModal ? (
        <div className="">
          <div
            className="bg-neutral-800 z-40 absolute h-full w-full flex justify-center items-center bg-opacity-80"
            onClick={() => setShowDeleteModal(false)}
          ></div>
          <div className="absolute bg-neutral-200 z-50 w-full min-h-[300px rounded-3xl p-4 mt-40">
            <div className="flex flex-col">
              <div className="flex justify-between p-1">
                <p></p>
                <Times
                  width={50}
                  height={50}
                  fill="#f57971"
                  onClick={() => setShowDeleteModal(!showDeleteModal)}
                />
              </div>
              <div className="px-10">
                <p className="text-xl text-center pt-4">Är du säker på att du vill radera denna biljettklass?</p>
                <div className="flex justify-center gap-8 pt-8 pb-4">
                  <button className="border-2 border-neutral-500 rounded-md text-md text-neutral-700 py-3 px-6">Behåll</button>
                  <button className="bg-red-400 shadow-md rounded-md text-md py-3 px-6" onClick={(e) => deleteTicket(e)}>Radera</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div>
        <Image
          src={imagePath}
          width={500}
          height={500}
          alt=""
          className="rounded-md"
        />
      </div>
      <div className="px-3">
        <div className="text-5xl text-center pt-5">{eventInfo.eventName}</div>
        <button
          className="bg-[#d57187] w-full p-5 text-xl rounded-lg"
          onClick={() => setShowModal(true)}
        >
          Ny biljett
        </button>
        <div>
          {allTickets
            ? allTickets.map((ticket) => (
                <TicketCard key={ticket.eventName} ticket={ticket} toggle={() => setShowDeleteModal(!showDeleteModal)} setSelectedTicketClass={(ticketClass) => setSelectedTicketClass(ticketClass)}/>
              ))
            : null}
        </div>
      </div>
    </div>
  );
}

export const getStaticPaths = async () => {
  const res = await fetch(
    "https://47yon8pxx3.execute-api.eu-west-2.amazonaws.com/rouge-api/get-events"
  );
  const data = await res.json();

  const paths = data.map((event) => ({
    params: { eventName: event.eventName },
  }));

  return { paths, fallback: false };
};

export async function getStaticProps({ params }) {
  // could try to just fetch one event using the params
  const res = await fetch(
    `https://47yon8pxx3.execute-api.eu-west-2.amazonaws.com/rouge-api/get-event?eventName=${params.eventName}`
  );
  const eventInfo = await res.json();

  return {
    props: {
      eventInfo,
    },
  };
}
