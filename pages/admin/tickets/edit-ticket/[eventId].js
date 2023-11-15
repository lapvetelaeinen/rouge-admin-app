import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import Plus from "../../../../components/svg-components/Plus";
import RougeButton from "../../../../components/RougeButton";
import AddPriceLevelComponent from "../../../../components/AddPriceLevelComponent";
import AngleDown from "../../../../components/svg-components/AngleDown";
import { useRouter } from "next/router";

export default function EditTicketPage({ tickets, selectedTicket }) {
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState(null);
  const [priceLevels, setPriceLevels] = useState(selectedTicket.priceLevels);
  const [ticketLevels, setTicketLevels] = useState(selectedTicket.ticketLevels);
  const [levels, setLevels] = useState(selectedTicket.levels);
  const [maxAmountOfTickets, setMaxAmountOfTickets] = useState(
    selectedTicket.maxAmount
  );
  const [startingPrice, setStartingPrice] = useState(
    selectedTicket.priceLevels[0]
  );

  const router = useRouter();

  const {
    reset,
    unregister,
    control,
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const deleteField = (field) => {
    const fieldIndex = field.split(".")[1];

    const newLevels = [...levels];
    newLevels.splice(fieldIndex, 1);
    unregister(`levels`);
    setLevels(newLevels);
    console.log(newLevels);
  };

  const onSubmit = (data) => {
    incrementStair("submit");
  };

  const incrementStair = async (method) => {
    const formLevels = watch("levels");

    console.log(formLevels);

    //get max amount of tickets from form
    const maxAmount = Number(formLevels[0].amount);
    setMaxAmountOfTickets(maxAmount);

    const newLevels = [];
    const currentError = null;

    for (let index = 0; index < formLevels.length; index++) {
      const level = formLevels[index];
      const amount = Number(level.amount);
      const price = Number(level.price);

      if (index === 0) {
        if (amount <= 0) {
          setError({
            type: "amount",
            field: index,
            message: "Antalet biljetter måste vara högre än 0",
          });
          currentError = true;
          newLevels.push({ amount: amount, price: price });
          return;
        } else if (price <= 0) {
          setError({
            type: "price",
            field: index,
            message: "Priset måste vara högre än 0",
          });
          currentError = true;
          newLevels.push({ amount: amount, price: price });
          return;
        } else {
          newLevels.push({ amount: amount, price: price });
          // newLevels.push({ price: 0, amount: 0 });
        }
      }

      if (index != 0) {
        const previousLevel = formLevels[index - 1];
        const previousAmount = Number(previousLevel.amount);
        const previousPrice = Number(previousLevel.price);

        if (index === 1) {
          if (amount >= previousAmount || amount <= 0) {
            // Check if it is the first level and amount is greater than or equal to the previous amount or 0.
            setError({
              type: "amount",
              field: index,
              message:
                "Antalet biljetter måste vara mindre än max antalet och högre än 0",
            });
            currentError = true;
            newLevels.push({ amount: amount, price: price });
            return;
          } else if (price <= previousPrice) {
            // Check if it is the first level and price is less than or equal to the previous price.
            setError({
              type: "price",
              field: index,
              message: "Du måste ange ett högre pris än startpriset!",
            });
            currentError = true;
            newLevels.push({ amount: amount, price: price });
            return;
          } else {
            newLevels.push({ amount: amount, price: price });

            // newLevels.push({ price: 0, amount: 0 });
          }
        } else {
          if (amount <= previousAmount || amount >= maxAmount) {
            // If it is not the first level, the amount needs to be higher than the previous level.
            setError({
              type: "amount",
              field: index,
              message:
                "Du måste ange ett högre antal biljetter än förra nivån!",
            });
            currentError = true;
            newLevels.push({ amount: amount, price: price });
            return;
          } else if (price <= previousPrice) {
            // If it is not the first level, the price needs to be higher than the previous level's price.
            setError({
              type: "price",
              field: index,
              message: "Du måste ange ett högre pris än förra nivån!",
            });
            currentError = true;
            newLevels.push({ amount: amount, price: price });
            return;
          } else {
            newLevels.push({ amount: amount, price: price });
            // newLevels.push({ price: 0, amount: 0 });
            // newLevel = { amount: amount, price: price };
          }
        }
      }
    }

    if (!currentError && method != "submit") {
      setError(null);
      newLevels.push({ price: 0, amount: 0 });
    }

    // if (lastLevelPrice === 0 || lastLevelPrice <= secondLastLevelPrice) {
    //   console.log("Du måste ange ett högre pris än förra nivån");
    //   return;
    // }

    // if (lastLevelAmount >= maxAmount) {
    //   console.log("Du har överskridit antalet maxbiljetter!");
    //   return;
    // }

    // if (lastLevelAmount === 0 || lastLevelAmount >= maxAmount) {
    //   console.log("something wrong with amount");
    //   return;
    // }

    // const newLevels = [...levels];

    setLevels(newLevels);

    if (method === "submit" && !currentError) {
      const maxAmount = newLevels[0].amount;
      newLevels[0].amount = 0;

      const payload = {
        type: "updateTicket",
        event: {
          pk: selectedTicket.pk,
          sk: selectedTicket.sk,
          maxAmount: maxAmount,
          price: newLevels[0].price,
          levels: newLevels,
        },
      };

      const lambdaResponse = await fetch("/api/aws", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      console.log("res: ", lambdaResponse);
      setError(null);
      router.push(`/admin/create-event/event/${selectedTicket.pk}`);
      return;
    }

    console.log("LEVELS: ", newLevels);
    console.log("FORMLEVELS: ", formLevels);
  };

  let { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "levels", // unique name for your Field Array
  });

  // useEffect(() => {
  //   if (levels.length < 2) {
  //     const newLevels = [...levels];
  //     newLevels.push({ price: 0, amount: 0 });
  //     setLevels(newLevels);
  //   }
  // }, []);

  return (
    <>
      <div className="min-h-screen">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-2 mt-12"
        >
          {/* <AddPriceLevelComponent /> */}
          <div className="px-4">
            {levels.map((item, index) => (
              <div key={index}>
                {index === 0 ? (
                  <div className="flex w-full text-xl text-center">
                    <p className="flex-1 pl-2 pb-2 font-semibold">Startpris</p>
                    <p className="flex-1 pl-2 pb-2 font-semibold">
                      Max biljetter
                    </p>
                  </div>
                ) : null}
                <div className="flex flex-col gap-2 items-center mb-4">
                  {index != 0 ? (
                    <div className="flex w-full text-lg text-center">
                      <p className="flex-1 w-full">Höj priset till</p>
                      <p className="flex-1 w-full">Efter</p>
                    </div>
                  ) : null}
                  <div className="relative flex gap-2">
                    <div
                      className={`${
                        error && error.field === index && error.type === "price"
                          ? "bg-red-200 border-red-400"
                          : ""
                      } py-4 relative flex text-center rounded-lg border-2 border-neutral-200 shadow-md w-[50%]`}
                    >
                      <input
                        type="number"
                        defaultValue={levels[index].price}
                        {...register(`levels.${index}.price`)}
                        className={`${
                          error &&
                          error.field === index &&
                          error.type === "price"
                            ? "bg-red-200"
                            : ""
                        } w-full text-center text-2xl`}
                      />
                      <p className="flex-1 text-2xl absolute right-4">sek</p>
                    </div>
                    <div
                      className={`${
                        error &&
                        error.field === index &&
                        error.type === "amount"
                          ? "bg-red-200 border-red-400"
                          : ""
                      } py-4 relative flex text-center rounded-lg border-2 border-neutral-200 shadow-md w-[50%]`}
                    >
                      <input
                        type="number"
                        defaultValue={
                          index === 0
                            ? maxAmountOfTickets
                            : levels[index].amount
                        }
                        {...register(`levels.${index}.amount`)}
                        className={`${
                          error &&
                          error.field === index &&
                          error.type === "amount"
                            ? "bg-red-200"
                            : ""
                        } w-full text-center text-2xl`}
                      />
                      <p className="flex-1 text-2xl absolute right-4">st</p>
                    </div>
                    {index > 0 && index === levels.length - 1 ? (
                      <div className="absolute right-0 bottom-0 translate-y-[120%] flex items-center z-50">
                        <div
                          onClick={() => deleteField(`levels.${index}`)}
                          className="bg-red-200 border-2 border-red-500 rounded-xl px-6 p-2 flex items-center justify-center"
                        >
                          Ta bort nivå
                        </div>
                      </div>
                    ) : null}
                  </div>
                  {error && error.field === index ? (
                    <p className="text-center px-6 text-red-600">
                      {error.message}
                    </p>
                  ) : null}

                  {/* <div onClick={() => removeItem(index)}>
                    <Trash width={18} fill="#f87171" />
                  </div> */}
                </div>
                <div className="flex flex-col relative justify-center items-center">
                  <div className="w-[2px] h-[10px] bg-neutral-400 mx-auto mt-2"></div>
                  <div className="w-[2px] h-[10px] bg-neutral-400 mx-auto mt-2"></div>
                  <div className="w-[2px] h-[10px] bg-neutral-400 mx-auto mt-2"></div>
                  <div className="absolute bottom-0 translate-y-[70%] translate-x-[-0.8px]">
                    <AngleDown width={12} fill="#a3a3a3" />
                  </div>
                </div>
              </div>
            ))}

            <div className="w-full flex justify-center mt-8">
              <button
                type="button"
                onClick={() => incrementStair()}
                className="bg-neutral-100 border-2 border-neutral-400 px-6 flex justify-center items-center gap-2 py-2 rounded-2xl shadow-lg mb-4 mt-2"
              >
                <p>Lägg till nivå</p>
                <Plus width={12} fill="gray" />
              </button>
            </div>
          </div>

          <input
            type="submit"
            value="Spara ändringar"
            className="bg-purple-500 mx-4 text-white drop-shadow-md py-5 text-2xl rounded-full mb-2 mt-6"
          />
        </form>

        <div
          onClick={() =>
            router.push(`/admin/create-event/event/${selectedTicket.pk}`)
          }
          className="border-2 border-neutral-700 mx-4 text-neutral-700 text-center py-5 text-2xl rounded-full mb-2 mt-6 mb-24"
        >
          Avbryt
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ query }) {
  // Call external API from here directly
  const res = await fetch(
    "https://pb0u12mmmh.execute-api.eu-north-1.amazonaws.com/rouge/admin",
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
  const ticketInfo = data.event;

  console.log("LEVELS: ", ticketInfo.levels);

  const res2 = await fetch(
    "https://pb0u12mmmh.execute-api.eu-north-1.amazonaws.com/rouge/admin",
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

  return {
    props: { tickets: data2.tickets, selectedTicket: ticketInfo },
  };
}
