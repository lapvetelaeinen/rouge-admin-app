import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";
import Loader from "./Loader";
import Times from "./svg-components/Times";
import Trash from "./svg-components/Trash";
import Plus from "./svg-components/Plus";
import { syncIndexes } from "mongoose";

export default function StairForm({
  ticket,
  setShowStairsModal,
  getAllEvents,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [stairTickets, setStairTickets] = useState(JSON.parse(ticket.stair));
  const [returnedStair, setReturnedStair] = [];

  const {
    reset,
    control,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();


  let stair = [...stairTickets];
  let stairValues = [];
  let newStair = [];

  stair.forEach((el, index) => {
    stairValues.push(el.amount);
  });

  stairValues.forEach((el, index) => {
    if(index === 0){
      newStair.push({price: parseInt(stair[index].price), amount: parseInt(stair[index].amount)});
    } else {
      let sum = stairValues[index] - stairValues[index - 1];
      newStair.push({price: parseInt(stair[index].price), amount: sum});
    }
  });


  const onSubmit = async (data) => {
    const stair = [...data.test];
    let stairValues = [];
    let newStair = [];
    const stairLength = stair.length;

    stair.forEach((el, index) => {
      stairValues.push(el.amount);
    });
    
    stairValues.forEach((el, index) => {
      if(index === 0){
        newStair.push({price: parseInt(stair[index].price), amount: parseInt(stair[index].amount)});
      } else {
        let sum = 0;
        for (let i = 0; i <= index; i++) {
          sum += parseInt(stairValues[i]);
        }
        newStair.push({price: parseInt(stair[index].price), amount: sum});
      }
    });

    console.log("STAIR VALUES: ", stairValues);
    console.log("NEW STAIR: ", newStair);

    const params = {
      eventName: ticket.eventName,
      ticketClass: ticket.ticketClass,
      stair: JSON.stringify(newStair),
    };

    console.log(params);

    setIsLoading(true);
    await axios.post(
      "https://47yon8pxx3.execute-api.eu-west-2.amazonaws.com/rouge-api/update-ticket",
      params
    );
    setIsLoading(false);
    getAllEvents();
    setShowStairsModal();
    reset();
  };

  const incrementStair = () => {
    const newTickets = [...stairTickets];
    newTickets.push({ amount: "Antal", price: "Pris" });
    setStairTickets(newTickets);
    append({});
  };

  const removeItem = async (index) => {
    const stair = [...stairTickets];

    if (index > -1) {
      stair.splice(index, 1);
    }

    const params = {
      eventName: ticket.eventName,
      ticketClass: ticket.ticketClass,
      stair: JSON.stringify(stair),
    };

    console.log(params);

    setIsLoading(true);
    await axios.post(
      "https://47yon8pxx3.execute-api.eu-west-2.amazonaws.com/rouge-api/update-ticket",
      params
    );
    setIsLoading(false);
    getAllEvents();
    setShowStairsModal();
  };

  let { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "test", // unique name for your Field Array
  });

  return (
    <div className="absolute bg-neutral-200 z-50 w-full min-h-[300px rounded-3xl p-4 mt-40">
      <div className="flex flex-col">
        <div className="flex justify-between p-1">
          <p></p>
          {isLoading && <Loader />}
          <Times
            width={50}
            height={50}
            fill="#f57971"
            onClick={() => setShowStairsModal()}
          />
        </div>
        <div className="">
          <form onSubmit={handleSubmit((data) => onSubmit(data))}>
            <div className="flex gap-2 items-center mb-4 text-xl">
            <div className="flex-1">Pris</div>
            <div className="flex-1 mr-4">Antal</div>

            </div>
            <div className="">
              {newStair.map((item, index) => (
                <div key={item.id} className="flex gap-2 items-center mb-4">
                  <input
                    type="number"
                    {...register(`test.${index}.price`)}
                    defaultValue={item.price}
                    className="py-4 pl-6 rounded-lg shadow-md w-[50%]"
                  />
                  <input
                  type="number"
                    {...register(`test.${index}.amount`)}
                    defaultValue={item.amount}
                    className="py-4 pl-6 rounded-lg shadow-md w-[50%]"
                  />
                  <div onClick={() => removeItem(index)}>
                    <Trash width={18} fill="#f87171" />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => incrementStair()}
                className="bg-neutral-300 w-1/4 flex justify-center py-2 rounded-2xl shadow-lg mb-4"
              >
                <Plus width={17} />
              </button>
              <input
                type="submit"
                className="w-full p-4 bg-[#d57187] placeholder-neutral-700 text-neutral-900 rounded-md shadow-sm"
                value="Spara"
              />
            </div>
          </form>
        </div>

        {/* <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className="flex flex-col items-center gap-4">
          <div>
            {stairTickets.map((el, index) => (
              <>
                <div className="flex gap-2 mt-2">
                  <input
                    type="number"
                    placeholder="Pris"
                    name={`test.${index}.price`}
                    defaultValue={el.price}
                    {...register(`test.${index}.price`)}
                    className="w-full p-4 bg-neutral-100 placeholder-neutral-700 text-neutral-900 rounded-md shadow-sm"
                  />

                  <input
                    type="number"
                    placeholder="Antal"
                    name={`test.${index}.amount`}
                    defaultValue={el.amount}
                    {...register(`test.${index}.amount`)}
                    className="w-full p-4 bg-neutral-100 placeholder-neutral-700 text-neutral-900 rounded-md shadow-sm"
                  />
                </div>
              </>
            ))}
          </div>
          <div className="flex justify-center bg-neutral-300 w-1/4 py-2 rounded-2xl text-2xl font-bold shadow-xl mb-4" onClick={() => incrementStair()}>
            <Plus width={17} fill="#737373"/>
          </div>

          <input
            type="submit"
            className="w-full p-4 bg-[#d57187] placeholder-neutral-700 text-neutral-900 rounded-md shadow-sm text-xl"
            value="Spara"
          />
        </form> */}
      </div>
    </div>
  );
}
