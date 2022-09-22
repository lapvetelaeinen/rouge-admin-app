import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import EventListTile from "../../../components/EventListTile";
import Times from "../../../components/svg-components/Times";

export default function CreateTickets() {

    const [allEvents, setAllEvents] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const toggleModal = () => {
        setShowModal(!showModal);
      };

      const onSubmit = async (data) => {

    
        const params = 
          {
            eventName: selectedEvent.eventName,
            ticketClass: data.ticketClass,
            price: data.price,
            maxAmount: data.maxAmount,
          };
    
        if (data) {
    
          axios.post("https://47yon8pxx3.execute-api.eu-west-2.amazonaws.com/rouge-api/create-ticket", params);
          reset();
    
        } else {
          return;
        }
      };

      const {
        reset,
        register,
        formState: { errors },
        handleSubmit,
      } = useForm();


    useEffect(() => {
        if(!allEvents){
          axios.get("https://47yon8pxx3.execute-api.eu-west-2.amazonaws.com/rouge-api/get-events").then(res => setAllEvents(res.data));
          console.log("this is events: ", allEvents);
        } return;
    
        });
  return (
    <>
      <div className="bg-slate-800 min-h-screen">
      {showModal ? (
        <div className="bg-neutral-800 absolute z-50 h-full w-full flex justify-center items-center bg-opacity-80">
          <div className="bg-neutral-200 w-full min-h-[300px] m-4 rounded-3xl mb-40">
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
        <div className="pt-14 pb-20">
          <h1 className="text-center text-4xl text-neutral-500 font-bold">
            Biljettsläpp
          </h1>
          <p className="text-center pt-6 px-4 text-neutral-600">
            Välj ett event från listan för att lägga till nya biljetter eller
            för att uppdatera pris och antal på gamla biljetter.
          </p>
        </div>
        <p className="pl-4 pb-4 text-3xl font-bold text-neutral-600">
        Dina events
      </p>
      <div className="flex flex-col gap-4">
        {allEvents
          ? allEvents.map((event) => (
              <div key={event.eventName}>
                <EventListTile
                  key={event.eventName}
                  id={event.eventName}
                  event={event}
                />
              </div>
            ))
          : null}
      </div>
      </div>
    </>
  );
}
