import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import Plus from "../../../../components/svg-components/Plus";
import RougeButton from "../../../../components/RougeButton";
import AddPriceLevelComponent from "../../../../components/AddPriceLevelComponent";

export default function EditTicketPage({ tickets, selectedTicket }) {
  const [ticket, setTicket] = useState(null);
  const [priceLevels, setPriceLevels] = useState(selectedTicket.priceLevels);
  const [ticketLevels, setTicketLevels] = useState(selectedTicket.ticketLevels);
  const [levels, setLevels] = useState(selectedTicket.levels);
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
    const currentLevels = [...levels];
    const formLevels = watch("levels");
    const lastLevel = formLevels[formLevels.length - 1];
    const lastLevelPrice = Number(lastLevel.price);
    const lastLevelAmount = Number(lastLevel.amount);
    const secondLastLevel = formLevels[formLevels.length - 2];
    const secondLastLevelPrice = Number(secondLastLevel.price);
    const secondLastLevelAmount = Number(secondLastLevel.amount);

    console.log("lastlevel price: ", lastLevelPrice);
    console.log("secondlastlevel price: ", secondLastLevelPrice);

    //get max amount of tickets from form
    const maxAmount = Number(formLevels[0].amount);
    setMaxAmountOfTickets(maxAmount);

    //calculate total amount of tickets
    let amountOfTickets = 0;

    formLevels.forEach((level, index) => {
      if (index === 0) {
        return;
      }

      const amount = Number(level.amount);
      const price = Number(level.price);
      const previousLevel = formLevels[index - 1];
      const previousAmount = Number(previousLevel.amount);
      const previousPrice = Number(previousLevel.price);

      if (index === 1 && amount >= previousAmount) {
        console.log("AMOUNT: ", amount);
        console.log("PREVIOUS AMOUNT: ", previousAmount);
        console.log("Du har överskridit maxgränsen för biljetter!");
        return;
      } else if (index != 1 && amount <= previousAmount) {
        console.log("AMOUNT: ", amount);
        console.log("PREVIOUS AMOUNT: ", previousAmount);
        console.log(
          "Du måste ange ett antal biljetter som är högre än det förra!"
        );
        return;
      } else if (price <= previousPrice) {
        console.log("Du måste ange ett högre pris än förra nivån!");
        return;
      }

      amountOfTickets += amount;
    });

    console.log("This is total amount of tickets: ", amountOfTickets);

    // if (lastLevelAmount <= secondLastLevelAmount && ) {
    //   console.log("LAST LEVEL AMOUNT: ", lastLevelAmount);
    //   console.log("SECOND LAST LEVEL AMOUNT: ", secondLastLevelAmount);
    //   console.log(
    //     "Du måste ange ett högre antal biljetter än den förra nivån."
    //   );
    //   return;
    // }

    if (lastLevelPrice === 0 || lastLevelPrice <= secondLastLevelPrice) {
      console.log("Du måste ange ett högre pris än förra nivån");
      return;
    }

    if (lastLevelAmount >= maxAmount) {
      console.log("Du har överskridit antalet maxbiljetter!");
      return;
    }

    if (lastLevelAmount === 0 || lastLevelAmount >= maxAmount) {
      console.log("something wrong with amount");
      return;
    }

    const newLevels = [...levels];
    newLevels.push({ price: 0, amount: 0 });
    setLevels(newLevels);

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

  useEffect(() => {
    if (levels.length < 2) {
      const newLevels = [...levels];
      newLevels.push({ price: 0, amount: 0 });
      setLevels(newLevels);
    }
  }, []);

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
                    <p className="flex-1 pl-2 pb-2">Startpris</p>
                    <p className="flex-1 pl-2 pb-2">Max biljetter</p>
                  </div>
                ) : null}
                <div className="flex flex-col gap-2 items-center mb-4">
                  {index != 0 ? (
                    <div className="flex w-full text-center">
                      <p className="flex-1 w-full">Höj priset till</p>
                      <p className="flex-1 w-full">Efter</p>
                    </div>
                  ) : null}
                  <div className="flex gap-2">
                    <div className="py-4 relative flex text-center rounded-lg border-2 border-neutral-200 shadow-md w-[50%]">
                      <input
                        type="number"
                        defaultValue={levels[index].price}
                        {...register(`levels.${index}.price`)}
                        className="w-full text-center text-2xl"
                      />
                      <p className="flex-1 text-2xl absolute right-4">sek</p>
                    </div>
                    <div className="py-4 relative flex text-center rounded-lg border-2 border-neutral-200 shadow-md w-[50%]">
                      <input
                        type="number"
                        defaultValue={levels[index].amount}
                        {...register(`levels.${index}.amount`)}
                        className="w-full text-center text-2xl"
                      />
                      <p className="flex-1 text-2xl absolute right-4">st</p>
                    </div>
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
  const ticketInfo = data.event;

  console.log("LEVELS: ", ticketInfo.levels);

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

  return {
    props: { tickets: data2.tickets, selectedTicket: ticketInfo },
  };
}
