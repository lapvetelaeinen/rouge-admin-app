import { useForm } from "react-hook-form";
import Times from "./svg-components/Times";

export default function EditScreen({ card, close, deleteCard, setIsEdit }) {
  const { register, reset, handleSubmit } = useForm();

  const onSubmit = (data) => {
    let updateValues = { ...data };
    updateValues.code = card.code;
    console.log(updateValues);
    updateCard(updateValues);
    reset();
    setIsEdit(false);
  };

  const updateCard = async (data) => {
    const url =
      "https://47yon8pxx3.execute-api.eu-west-2.amazonaws.com/rouge-api/create-member-card";

    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        type: "updateCard",
        updates: data,
      }),
    });

    const jsonData = await res.json();

    console.log("Message from server: ", data);
  };

  const terminateCard = (e) => {
    e.preventDefault();
    console.log("Deleting card... ", card);
    deleteCard();
    setIsEdit(false);
  };

  return (
    <>
      <div className="bg-slate-800 min-h-screen flex justify-center">
        <div className=" pt-12 md:pt-24 w-full md:w-[400px] md:pb-12">
          <div className="w-full flex justify-end mb-8" onClick={close}>
            <Times width={80} height={80} fill="grey" className="p-4" />
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 px-2"
          >
            <p className="text-center text-neutral-200 text-4xl md:text-5xl mb-6">
              Ändra medlemskort
            </p>
            <label className="">
              <p className="text-2xl text-neutral-200 pb-2">Namn</p>
              <input
                type="text"
                defaultValue={card.cardName}
                name="cardName"
                {...register("cardName", {
                  required: "Du måste ge kortet ett namn",
                })}
                className="py-4 pl-4 text-xl w-full"
              />
            </label>
            <label>
              <p className="text-2xl text-neutral-200 pb-2">Kod</p>
              <input
                type="text"
                defaultValue={card.code}
                placeholder="Kod"
                name="code"
                {...register("code", {
                  required: "Du måste ange en kod",
                  disabled: true,
                })}
                className="py-4 pl-4 text-xl w-full"
              />
            </label>
            <label>
              <p className="text-2xl text-neutral-200 pb-2">Antal</p>
              <input
                type="number"
                defaultValue={card.amount}
                placeholder="Antal"
                name="amount"
                {...register("amount", {
                  required: "Du måste ange ett antal",
                })}
                className="py-4 pl-4 text-xl w-full"
              />
            </label>
            <p className="text-2xl text-center pb-2 pt-4 text-pink-500">
              Aktiverade kort: {card.used} st
            </p>
            <input
              type="submit"
              value="Ändra kort"
              className="bg-gradient-to-br from-pink-600 hover:from-pink-700 hover:to-violet-800 to-violet-700 py-4 rounded-lg text-xl text-neutral-200 cursor-pointer mt-2"
            />
            <button
              className="border-2 border-rose-600 py-4 rounded-lg text-xl text-rose-400 cursor-pointer mt-2"
              onClick={(e) => terminateCard(e)}
            >
              Radera kort
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
