import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import Plus from "../../../../components/svg-components/Plus";
import RougeButton from "../../../../components/RougeButton";
import AddPriceLevelComponent from "../../../../components/AddPriceLevelComponent";

export default function EditTicketPage({ tickets, selectedTicket }) {
  const [ticket, setTicket] = useState(null);
  const [priceLevels, setPriceLevels] = useState(selectedTicket.priceLevels);
  const [ticketLevels, setTicketLevels] = useState(selectedTicket.ticketLevels);
  const [levels, setLevels] = useState(null);
  const [maxAmountOfTickets, setMaxAmountOfTickets] = useState(
    selectedTicket.maxAmount
  );
  const [startingPrice, setStartingPrice] = useState(
    selectedTicket.priceLevels[0]
  );

  const {
    reset,
    control,
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  const incrementStair = () => {
    if (levels) {
      const newLevels = [...levels];
      newLevels.push({ price: "", amount: "" });
      setLevels(newLevels);
    } else {
      const formLevels = watch("levels");
      const newLevels = [...formLevels];
      newLevels.push({ price: "", amount: "" });
      setLevels(newLevels);
    }
    // const newPriceLevels = [...priceLevels];
    // const newTicketLevels = [...ticketLevels];
    // newPriceLevels.push("");
    // newTicketLevels.push("");
    // setPriceLevels(newPriceLevels);
    // setTicketLevels(newTicketLevels);
    // append({});
    console.log("LEVELS: ", levels);
  };

  let { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "levels", // unique name for your Field Array
  });

  return (
    <>
      <div className="min-h-screen">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-2 mt-12"
        >
          {/* <AddPriceLevelComponent /> */}
          <div className="px-4">
            {priceLevels.map((item, index) => (
              <div key={index}>
                {index === 0 ? (
                  <div className="flex w-full text-xl text-center">
                    <p className="flex-1 pl-2 pb-2">Startpris</p>
                    <p className="flex-1 pl-2 pb-2">Max biljetter</p>
                  </div>
                ) : null}
                <div className="flex gap-2 items-center mb-4">
                  <div className="py-4 relative flex text-center rounded-lg border-2 border-neutral-200 shadow-md w-[50%]">
                    <input
                      type="number"
                      defaultValue={priceLevels[index]}
                      {...register(`levels.${index}.price`)}
                      className="w-full text-center text-2xl"
                    />
                    <p className="flex-1 text-2xl absolute right-4">sek</p>
                  </div>
                  <div className="py-4 relative flex text-center rounded-lg border-2 border-neutral-200 shadow-md w-[50%]">
                    <input
                      type="number"
                      defaultValue={ticketLevels[index]}
                      {...register(`levels.${index}.amount`)}
                      className="w-full text-center text-2xl"
                    />
                    <p className="flex-1 text-2xl absolute right-4">st</p>
                  </div>

                  {/* <div onClick={() => removeItem(index)}>
                    <Trash width={18} fill="#f87171" />
                  </div> */}
                </div>
                <div className="w-[2px] h-[10px] bg-neutral-400 mx-auto mt-4"></div>
                <div className="w-[2px] h-[10px] bg-neutral-400 mx-auto mt-2"></div>
                <div className="w-[2px] h-[10px] bg-neutral-400 mx-auto mt-2"></div>
              </div>
            ))}
            {priceLevels.length < 2 ? (
              <>
                <div className="flex w-full text-xl text-center">
                  <p className="flex-1 pl-2 pb-2">Höj till</p>
                  <p className="flex-1 pl-2 pb-2">Efter</p>
                </div>
                <div className="flex gap-2 items-center mb-4">
                  <div className="py-4 relative flex text-center rounded-lg border-2 border-neutral-200 shadow-md w-[50%]">
                    <input
                      type="number"
                      {...register(`levels.${1}.price`)}
                      className="w-full text-center text-2xl"
                    />
                    <p className="flex-1 text-2xl absolute right-4">sek</p>
                  </div>
                  <div className="py-4 relative flex text-center rounded-lg border-2 border-neutral-200 shadow-md w-[50%]">
                    <input
                      type="number"
                      {...register(`levels.${1}.amount`)}
                      className="w-full text-center text-2xl"
                    />
                    <p className="flex-1 text-2xl absolute right-4">st</p>
                  </div>
                  {/* <div onClick={() => removeItem(index)}>
                    <Trash width={18} fill="#f87171" />
                  </div> */}
                </div>
              </>
            ) : null}
            <div className="w-full flex justify-center">
              <button
                type="button"
                onClick={() => incrementStair()}
                className="bg-neutral-100 border-2 border-neutral-400 w-1/4 flex justify-center py-2 rounded-2xl shadow-lg mb-4 mt-2"
              >
                <Plus width={17} fill="gray" />
              </button>
            </div>
          </div>

          <input
            type="submit"
            value="Spara ändringar"
            className="bg-purple-500 text-white drop-shadow-md py-5 text-2xl rounded-full mb-2 mt-6"
          />
          <RougeButton type="secondary" text="Avbryt" />
        </form>
      </div>
    </>
  );
}

export async function getServerSideProps({ query }) {
  // Call external API from here directly
  const res = await fetch(
    "https://h6yb5bsx6a.execute-api.eu-north-1.amazonaws.com/rouge/admin",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "getTicket",
        eventId: query.eventId,
        ticketClass: query.ticket,
      }),
    }
  );

  const data = await res.json();

  console.log("getTicket: ", data);

  const res2 = await fetch(
    "https://h6yb5bsx6a.execute-api.eu-north-1.amazonaws.com/rouge/admin",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "getAllTickets",
        eventId: query.eventId,
      }),
    }
  );

  const data2 = await res2.json();

  console.log("query: ", query);

  return {
    props: { tickets: data2.tickets, selectedTicket: data.event },
  };
}
