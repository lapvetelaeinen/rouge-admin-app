import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import Plus from "../../../../components/svg-components/Plus";
import RougeButton from "../../../../components/RougeButton";
import AddPriceLevelComponent from "../../../../components/AddPriceLevelComponent";

export default function EditTicketPage({ tickets, selectedTicket }) {
  const [ticket, setTicket] = useState(null);
  const [priceLevels, setPriceLevels] = useState([]);
  const [ticketLevels, setTicketLevels] = useState([]);

  const {
    reset,
    control,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  const incrementStair = () => {
    const newPriceLevels = [...priceLevels];
    const newTicketLevels = [...ticketLevels];
    newPriceLevels.push("");
    newTicketLevels.push("");
    setPriceLevels(newPriceLevels);
    setTicketLevels(newTicketLevels);
    append({});
  };

  let { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "test", // unique name for your Field Array
  });

  useEffect(() => {
    const keyToSearch = "sk";
    const valueToSearch = selectedTicket;

    // Find the object with the specified value for the key
    const foundObject = tickets.find(
      (item) => item[keyToSearch] === valueToSearch
    );

    if (foundObject) {
      setTicket(foundObject);
      setTicketLevels(foundObject.ticketLevels);
      setPriceLevels(foundObject.priceLevels);
    } else {
      console.log("Object not found.");
    }
  }, []);

  return (
    <>
      <div className="min-h-screen">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <div className="flex items-center bg-neutral-100 py-2 px-6 rounded-full shadow-lg mt-4">
            <p className="text-xl leading-none text-center w-1/2">
              Max antal biljetter
            </p>
            <input
              autoComplete="off"
              className="py-4 pl-4 w-1/2 text-2xl bg-neutral-100"
              type="number"
              defaultValue={ticket ? ticket.maxAmount : ""}
              placeholder="Antal"
              {...register("amount", { required: true, maxLength: 80 })}
            />
          </div>
          <div className="flex items-center bg-neutral-100 py-2 px-6 rounded-full shadow-lg mt-4">
            <p className="text-xl leading-none text-center w-1/2">Startpris</p>
            <input
              autoComplete="off"
              className="py-4 pl-4 w-1/2 text-2xl bg-neutral-100"
              type="number"
              defaultValue={ticket ? ticket.price : ""}
              placeholder="Pris"
              {...register("price", { required: true, maxLength: 80 })}
            />
          </div>
          <div className="w-[2px] h-[10px] bg-neutral-400 mx-auto mt-4"></div>
          <div className="w-[2px] h-[10px] bg-neutral-400 mx-auto"></div>
          <div className="w-[2px] h-[10px] bg-neutral-400 mx-auto"></div>

          {/* <AddPriceLevelComponent /> */}
          <div className="">
            {priceLevels.length < 2
              ? priceLevels.map((item, index) => (
                  <>
                    <div key={item.id} className="flex gap-2 items-center mb-4">
                      <input
                        type="number"
                        defaultValue={priceLevels[index]}
                        {...register(`test.${index}.price`)}
                        className="py-4 pl-6 rounded-lg shadow-md w-[50%]"
                      />
                      <input
                        type="number"
                        defaultValue={ticketLevels[index]}
                        {...register(`test.${index}.amount`)}
                        className="py-4 pl-6 rounded-lg shadow-md w-[50%]"
                      />
                      {/* <div onClick={() => removeItem(index)}>
                    <Trash width={18} fill="#f87171" />
                  </div> */}
                    </div>
                    <div className="w-[2px] h-[10px] bg-neutral-400 mx-auto mt-4"></div>
                    <div className="w-[2px] h-[10px] bg-neutral-400 mx-auto mt-2"></div>
                    <div className="w-[2px] h-[10px] bg-neutral-400 mx-auto mt-2"></div>
                  </>
                ))
              : null}
            <button
              type="button"
              onClick={() => incrementStair()}
              className="bg-neutral-300 w-1/4 flex justify-center py-2 rounded-2xl shadow-lg mb-4"
            >
              <Plus width={17} />
            </button>
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
    props: { tickets: data2.tickets, selectedTicket: query.ticket },
  };
}
