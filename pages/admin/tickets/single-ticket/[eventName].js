import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import Image from "next/image";
import Times from "../../../../components/svg-components/Times";
import Plus from "../../../../components/svg-components/Plus";
import StairForm from "../../../../components/StairForm";
import Select from "react-select";

import TicketCard from "../../../../components/TicketCard";
import Loader from "../../../../components/Loader";

export default function TicketsPage({ eventInfo }) {
  const router = useRouter();
  const [allTickets, setAllTickets] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStairsModal, setShowStairsModal] = useState(false);
  const [selectedTicketClass, setSelectedTicketClass] = useState(null);
  const [selectedStairTicket, setSelectedStairTicket] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isNewTicket, setIsNewTicket] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState("");
  const [allSavedTicketClasses, setAllSavedTicketClasses] = useState(null);
  const [salesReport, setSalesReport] = useState(null);

  const BUCKET_URL = "https://rouge-event-images.s3.eu-west-2.amazonaws.com/";
  const imagePath = BUCKET_URL + eventInfo.image;

  const selectOptions = [
  ];

  const registerOptions = {
    // ...
    role: { required: "Role is required" },
  };

  const {
    reset,
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm();

  const onSubmit = async (data) => {
    const stair = [
      {
        amount: data.maxAmount,
        price: data.price,
      },
    ];

    const params = {
      eventName: eventInfo.eventName,
      eventDate: eventInfo.eventDate,
      ticketClass: isNewTicket ? data.ticketClass : selectedTicket,
      price: data.price,
      maxAmount: data.maxAmount,
      sold: 0,
      isFirstTicket: allTickets.length > 0 ? "no" : "yes",
      stair: JSON.stringify(stair),
      isNewTicket: isNewTicket ? "yes" : "no"
    };

    if (data) {
      console.log(params);
      setIsLoading(true);
      setShowModal(false);
      await axios.post(
        "https://47yon8pxx3.execute-api.eu-west-2.amazonaws.com/rouge-api/create-ticket",
        params
      );
      setIsLoading(false);
      getAllEvents();
      reset();
      setIsNewTicket(false);
    } else {
      return;
    }
  };

  const deleteTicket = async () => {
    const params = {
      eventName: eventInfo.eventName,
      eventDate: eventInfo.eventDate,
      ticketClass: selectedTicketClass,
      isLastTicket: allTickets.length === 1 ? "yes" : "no",
    };
    setIsLoading(true);
    setShowDeleteModal(false);
    await axios.post(
      "https://47yon8pxx3.execute-api.eu-west-2.amazonaws.com/rouge-api/delete-ticket",
      params
    );
    setIsLoading(false);

    getAllEvents();
  };

  const getAllEvents = async () => {
    const tickets = await axios.get(
      `https://47yon8pxx3.execute-api.eu-west-2.amazonaws.com/rouge-api/get-tickets?eventName=${eventInfo.eventName}`
    );
    setAllTickets(tickets.data);

    const ticketClasses = await axios.get("https://47yon8pxx3.execute-api.eu-west-2.amazonaws.com/rouge-api/get-saved-ticket-classes");
    setAllSavedTicketClasses(ticketClasses.data);
  };

  useEffect(() => {
    if (!allTickets) {
      axios
        .get(
          `https://47yon8pxx3.execute-api.eu-west-2.amazonaws.com/rouge-api/get-tickets?eventName=${eventInfo.eventName}`
        )
        .then((res) => setAllTickets(res.data));
    }
    if (allTickets) {
      console.log(allTickets.length);
    }
    if (!allSavedTicketClasses) {
      axios
        .get(
          `https://47yon8pxx3.execute-api.eu-west-2.amazonaws.com/rouge-api/get-saved-ticket-classes`
        )
        .then((res) => setAllSavedTicketClasses(res.data));
    }
    console.log("SAVED TICKET CLASSES >>>", allSavedTicketClasses);

    
    if (!salesReport){


      const getSales = async () => {
        await axios
        .post(
          "https://47yon8pxx3.execute-api.eu-west-2.amazonaws.com/rouge-api/get-event-sales-report"
        )
        .then((res) => {
            const allSales = res.data;
            let eventSales = [];

            allSales.forEach((el) => {
              if (el.eventName === eventInfo.eventName){
                eventSales.push(el);
              }
            });

            setSalesReport(eventSales);
        });
      };

      getSales();
  

  
    }
    return;
  });

  const handleChange = (selectedOption) => {
    setSelectedTicket(selectedOption.value);
  }

  return (
    <div className="min-h-screen bg-slate-800 relative md:px-28 md:py-10">
      {isLoading && <Loader />}
      {showModal ? (
        <div className="">
          <div
            className="bg-neutral-800 z-40 absolute h-full w-full flex justify-center items-center bg-opacity-80"
            onClick={() => setShowModal(false)}
          ></div>
          <div className="absolute bg-neutral-200 z-50 w-full min-h-[300px rounded-3xl p-4 mt-40">
            <div className="flex flex-col">
              <div className="flex justify-end p-1 mb-6">
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
                className="flex flex-col gap-3 items-center"
              >
                <div
                  className={`${
                    isNewTicket ? "items-center" : "items-end"
                  } w-full flex gap-4`}
                >
                  <div className="flex-1">
                    {isNewTicket ? (
                      <div>
                        <input
                          type="text"
                          placeholder="Ny biljettklass"
                          name="ticketClass"
                          {...register("ticketClass")}
                          className="w-full p-4 bg-violet-200 border-2 border-neutral-500 placeholder-neutral-700 text-neutral-900 rounded-md shadow-sm"
                        />
                      </div>
                    ) : (
                      <>
                        {" "}

                        <Controller
                          name="role"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <Select
                              options={allSavedTicketClasses ? allSavedTicketClasses : selectOptions}
                              placeholder="Välj biljettklass..."
                              onChange={handleChange}
                            />
                          )}
                        />
                        <small className="text-danger">
                          {errors?.role && errors.role.message}
                        </small>
                      </>
                    )}
                  </div>
                  <div
                    className={`${
                      isNewTicket ? "bg-red-400" : "bg-neutral-300"
                    } p-3 w-10 h-10 text-center flex justify-center items-center font-bold text-xl rounded-xl shaodw-xl`}
                    onClick={() => setIsNewTicket(!isNewTicket)}
                  >
                    <p className="mb-1">
                      {isNewTicket ? (
                        <Times
                          width={20}
                          height={20}
                          fill="#525252"
                          className="mt-2"
                        />
                      ) : (
                        "+"
                      )}
                    </p>
                  </div>
                </div>

                <input
                  type="number"
                  placeholder="Pris per biljett"
                  name="price"
                  {...register("price")}
                  className="w-full p-4 bg-neutral-100 placeholder-neutral-700 text-neutral-900 rounded-md shadow-sm"
                />

                <input
                  type="number"
                  placeholder="Antal biljetter"
                  name="maxAmount"
                  {...register("maxAmount")}
                  className="w-full p-4 bg-neutral-100 placeholder-neutral-700 text-neutral-900 rounded-md shadow-sm"
                />

                <input
                  type="submit"
                  className="w-full p-4 bg-[#d57187] placeholder-neutral-700 text-neutral-900 rounded-md shadow-sm"
                  value="Skapa"
                />
              </form>
            </div>
          </div>
        </div>
      ) : null}
      {showStairsModal ? (
        <div className="">
          <div
            className="bg-neutral-800 z-40 absolute h-full w-full flex justify-center items-center bg-opacity-80"
            onClick={() => {
              setShowStairsModal(false);
              setSelectedStairTicket(null);
            }}
          ></div>
          <StairForm
            ticket={selectedStairTicket}
            setShowStairsModal={() => setShowStairsModal(false)}
            getAllEvents={() => getAllEvents()}
          />
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
                <p className="text-xl text-center pt-4">
                  Är du säker på att du vill radera denna biljettklass?
                </p>
                <div className="flex justify-center gap-8 pt-8 pb-4">
                  <button
                    className="border-2 border-neutral-500 rounded-md text-md text-neutral-700 py-3 px-6"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Behåll
                  </button>
                  <button
                    className="bg-red-400 shadow-md rounded-md text-md py-3 px-6"
                    onClick={(e) => deleteTicket(e)}
                  >
                    Radera
                  </button>
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
        <div className="text-5xl text-center pt-5 text-violet-300">
          {eventInfo.eventName.split("_")[0].replace("-", " ").toUpperCase()}
        </div>
        <p className="text-center text-neutral-500">{eventInfo.eventDate}</p>
        <button
          className="bg-[#d57187] w-full p-5 text-xl rounded-lg mt-8 text-neutral-700"
          onClick={() => setShowModal(true)}
        >
          Ny biljett
        </button>
        <div>
          {allTickets
            ? allTickets.map((ticket) =>
                ticket.stair === "yes" ? null : (
                  <TicketCard
                    sales={salesReport ? salesReport : [{info: "Inga sålda biljetter"}]}
                    key={ticket.eventName}
                    ticket={ticket}
                    toggle={() => setShowDeleteModal(!showDeleteModal)}
                    setSelectedTicketClass={(ticketClass) =>
                      setSelectedTicketClass(ticketClass)
                    }
                    setSelectedStairTicket={(ticketClass) =>
                      setSelectedStairTicket(ticketClass)
                    }
                    setShowStairsModal={() => setShowStairsModal(true)}
                  />
                )
              )
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

  return { paths, fallback: "blocking" };
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
