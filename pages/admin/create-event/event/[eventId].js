import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import AddPriceLevelComponent from "../../../../components/AddPriceLevelComponent";
import CreateTicketsModal from "../../../../components/modals/CreateTicketsModal";
import EditEventModal from "../../../../components/modals/EditEventModal";
import BackButton from "../../../../components/BackButton";
import RougeButton from "../../../../components/RougeButton";
import Edit from "../../../../components/svg-components/Edit";
import Ticket from "../../../../components/svg-components/Ticket";
import Plus from "../../../../components/svg-components/Plus";

export default function EventPage({ event, tickets }) {
  const [isEditEventActive, setIsEditEventActive] = useState(false);
  const [isCreateTicketsActive, setIsCreateTicketsActive] = useState(false);
  const [allTickets, setAllTickets] = useState(tickets);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isPriceLevelsActive, setIsPriceLevelsActive] = useState(false);
  const [stair, setStair] = useState([]);

  const router = useRouter();

  const {
    register,
    reset,
    watch,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  function formatDate(dateString) {
    const date = new Date(dateString);

    const daysOfWeek = [
      "Söndag",
      "Måndag",
      "Tisdag",
      "Onsdag",
      "Torsdag",
      "Fredag",
      "Lördag",
    ];
    const monthsOfYear = [
      "januari",
      "februari",
      "mars",
      "april",
      "maj",
      "juni",
      "juli",
      "augusti",
      "september",
      "oktober",
      "november",
      "december",
    ];

    const dayOfWeek = daysOfWeek[date.getUTCDay()];
    const monthName = monthsOfYear[date.getUTCMonth()];
    const dayOfMonth = date.getUTCDate();

    return {
      dayOfWeek,
      monthName,
      dayOfMonth,
    };
  }

  const toggleTickets = () => {
    setIsCreateTicketsActive(!isCreateTicketsActive);
  };

  const toggleEdit = () => {
    setIsEditEventActive(!isEditEventActive);
  };

  const toggleEditTicket = (ticket) => {
    setSelectedTicket(ticket);
  };

  const saveChanges = () => {
    router.push("/admin/create-event/event/" + event.sk);
  };

  const goToEditTicket = (ticket) => {
    router.push(
      `/admin/tickets/edit-ticket/${event.sk}?ticket=${ticket.sk}&eventId=${event.sk}`
    );
  };

  const goBack = () => {
    router.push("/admin/create-event");
  };

  const onSubmit = (data) => {
    console.log(data);
  };

  const togglePriceLevels = () => {
    setIsPriceLevelsActive(!isPriceLevelsActive);
  };

  const incrementStair = () => {
    const newStair = [...stair];
    newStair.push({ amount: "Antal", price: "Pris" });
    setStair(newStair);
    append({});
  };

  let { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "test", // unique name for your Field Array
  });

  const newDateObj = formatDate(event.date);

  const day = newDateObj.dayOfWeek;
  const month = newDateObj.monthName;
  const dateNumber = newDateObj.dayOfMonth;

  const dateString = `${day} ${month} ${dateNumber}`;

  console.log("THESE ARE ALL THE TICKETS: ", allTickets);

  if (selectedTicket) {
    return (
      <>
        <BackButton action={() => setSelectedTicket(null)} />
        <div className="min-h-screen px-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2"
          >
            <div className="flex items-center bg-neutral-100 py-2 px-6 rounded-full shadow-lg mt-4">
              <p className="text-xl leading-none text-center w-1/2">
                Max antal biljetter
              </p>
              <input
                autoComplete="off"
                className="py-4 pl-4 w-1/2 text-2xl bg-neutral-100"
                type="number"
                defaultValue={selectedTicket.maxAmount}
                placeholder="Antal"
                {...register("amount", { required: true, maxLength: 80 })}
              />
            </div>
            <div className="flex items-center bg-neutral-100 py-2 px-6 rounded-full shadow-lg mt-4">
              <p className="text-xl leading-none text-center w-1/2">
                Startpris
              </p>
              <input
                autoComplete="off"
                className="py-4 pl-4 w-1/2 text-2xl bg-neutral-100"
                type="number"
                defaultValue={selectedTicket.price}
                placeholder="Pris"
                {...register("price", { required: true, maxLength: 80 })}
              />
            </div>
            <div className="w-[2px] h-[10px] bg-neutral-400 mx-auto mt-4"></div>
            <div className="w-[2px] h-[10px] bg-neutral-400 mx-auto"></div>
            <AddPriceLevelComponent />
            <button
              type="button"
              onClick={() => incrementStair()}
              className="bg-neutral-300 w-1/4 flex justify-center py-2 rounded-2xl shadow-lg mb-4"
            >
              <Plus width={17} />
            </button>
            <input
              type="submit"
              value="Spara ändringar"
              className="bg-purple-500 text-white drop-shadow-md py-5 text-2xl rounded-full mb-2 mt-6"
            />
            <RougeButton
              type="secondary"
              text="Avbryt"
              action={togglePriceLevels}
            />
          </form>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen">
        {isCreateTicketsActive ? (
          <CreateTicketsModal goBack={toggleTickets} eventId={event.sk} />
        ) : (
          <>
            {" "}
            <BackButton action={goBack} />
            <div className="p-4 bg-gradient-to-t from-neutral-200 to-white">
              <div className="relative w-full h-[400px] rounded-2xl drop-shadow-md overflow-clip">
                <Image
                  alt="event image"
                  src={event.image}
                  layout="fill"
                  className="object-cover"
                />
              </div>
              {isEditEventActive ? (
                <EditEventModal
                  toggleEdit={toggleEdit}
                  saveChanges={saveChanges}
                  event={event}
                />
              ) : (
                <div className="">
                  <div className="flex justify-between items-start mt-6">
                    <div>
                      <h1 className="text-4xl md:text-6xl font-extrabold text-neutral-800">
                        {event.eventName}
                      </h1>
                      <p className="text-xl italic text-neutral-500 mt-2">
                        {dateString}
                      </p>
                    </div>
                    <button onClick={toggleEdit}>
                      <div className="bg-neutral-50 flex justify-center items-center pt-2 pb-3 pl-3 pr-2 rounded-xl drop-shadow-2xl">
                        <Edit
                          width="35px"
                          cdight="35px"
                          fill="#7e22ce"
                          className=""
                        />
                      </div>
                    </button>
                  </div>
                  <p className="text-2xl text-neutral-600 mt-2">{event.info}</p>
                </div>
              )}
            </div>
            {isEditEventActive ? null : (
              <div className="flex flex-col pb-24">
                <h2 className="text-4xl font-bold mt-12 pl-4">Biljetter</h2>
                <div className="flex pt-12 gap-8 pb-12">
                  {allTickets ? (
                    <div className="flex ml-4 flex-row gap-2 md:gap-12 md:px-36 overflow-x-auto snap-x snap-mandatory w-full">
                      {allTickets.map((ticket, index) => {
                        console.log(ticket);
                        return (
                          <>
                            {" "}
                            <div
                              onClick={() => goToEditTicket(ticket)}
                              className={`relative mr-4 md:flex-1 w-[80vw] h-[400px] text-center flex-shrink-0 snap-start bg-gradient-to-tl from-neutral-200 to-neutral-100 ${
                                ticket.sk === "Student"
                                  ? "bg-gradient-to-tl from-green-200 to-green-100"
                                  : null
                              } ${
                                ticket.sk === "Kår"
                                  ? "bg-gradient-to-tl from-purple-200 to-purple-100"
                                  : null
                              } ${
                                ticket.sk === "Vanlig"
                                  ? "bg-gradient-to-tl from-red-200 to-red-100"
                                  : null
                              } rounded-2xl`}
                            >
                              <h2 className="text-4xl font-extrabold text-neutral-700 mt-4">
                                {ticket.sk}
                              </h2>
                              <div className="h-[1px] bg-neutral-600 mx-8 mt-6"></div>
                              <p className="text-2xl text-neutral-500 mt-2">
                                Pris
                              </p>
                              <p className="text-2xl text-neutral-400">
                                {ticket.price + " SEK"}
                              </p>
                              <div className="h-[1px] bg-neutral-600 mx-8 mt-6"></div>
                              <p className="text-2xl text-neutral-500 mt-2">
                                Max antal biljetter
                              </p>
                              <p className="text-2xl text-neutral-400">
                                {ticket.maxAmount + " st"}
                              </p>
                              <div className="h-[1px] bg-neutral-600 mx-8 mt-6"></div>
                              <p className="text-2xl text-neutral-500 mt-2">
                                Försäljning
                              </p>
                              <p className="text-2xl text-neutral-400">
                                {ticket.sold +
                                  " st (" +
                                  ticket.revenue +
                                  " SEK)"}
                              </p>
                            </div>
                          </>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="w-full h-[400px] flex flex-col justify-center items-center bg-gradient-to-tl from-neutral-200 to-neutral-100 rounded-2xl">
                      <Ticket
                        width="80px"
                        height="80px"
                        fill="#d6d3d1"
                        className=""
                      />
                      <p className="text-xl text-neutral-400">
                        Inga biljetter att visa
                      </p>
                    </div>
                  )}
                </div>
                <div className="px-4">
                  <RougeButton
                    type="main"
                    text="Skapa biljetter"
                    action={toggleTickets}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export async function getServerSideProps({ params }) {
  // Call external API from here directly

  const res = await fetch(
    "https://h6yb5bsx6a.execute-api.eu-north-1.amazonaws.com/rouge/admin",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "getEvent",
        eventId: params.eventId,
      }),
    }
  );

  const res2 = await fetch(
    "https://h6yb5bsx6a.execute-api.eu-north-1.amazonaws.com/rouge/admin",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "getAllTickets",
        eventId: params.eventId,
      }),
    }
  );

  const data = await res.json();
  const data2 = await res2.json();

  console.log("all tickets: ", data2);

  return {
    props: { event: data.event, tickets: data2.tickets },
  };
}
