import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import Pen from "../../components/svg-components/Pen";
import EditScreen from "../../components/EditScreen";

export default function CardsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [card, setCard] = useState(null);
  const [currentCards, setCurrentCards] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [cardToEdit, setCardToEdit] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    setCard(data);
    setSubmitted(true);
    reset();

    const url =
      "https://47yon8pxx3.execute-api.eu-west-2.amazonaws.com/rouge-api/create-member-card";

    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ card: data, type: "createCard" }),
    });

    const jsonData = await res.json();

    console.log("RESPONSE FROM SERVER: ", jsonData);
  };

  const getCards = async () => {
    const url =
      "https://47yon8pxx3.execute-api.eu-west-2.amazonaws.com/rouge-api/create-member-card";

    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ type: "getCards" }),
    });

    const jsonData = await res.json();

    setCurrentCards(jsonData);
  };

  const deleteCard = async () => {
    const url =
      "https://47yon8pxx3.execute-api.eu-west-2.amazonaws.com/rouge-api/create-member-card";

    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ type: "deleteCard", card: cardToEdit }),
    });

    const jsonData = await res.json();

    console.log("Message from server: ", jsonData);
  };

  const activateCard = async () => {
    const url =
      "https://47yon8pxx3.execute-api.eu-west-2.amazonaws.com/rouge-api/create-member-card";

    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ type: "activateCard" }),
    });

    const jsonData = await res.json();

    console.log("Message from server: ", jsonData);
  };

  const toggleEdit = (card) => {
    setCardToEdit(card);
    setIsEdit(true);
  };

  const closeEdit = () => {
    setIsEdit(false);
    setCardToEdit(null);
  };

  useEffect(() => {
    getCards();
  }, [submitted, isEdit]);

  console.log("CURRENT CARDS: ", currentCards);

  return (
    <>
      {isEdit && cardToEdit ? (
        <EditScreen
          card={cardToEdit}
          close={closeEdit}
          deleteCard={deleteCard}
          setIsEdit={setIsEdit}
        />
      ) : (
        <div className="min-h-screen bg-gradient-to-b from-slate-800 to bg-slate-900 pt-12 md:pt-24 flex flex-col justify-center items-center">
          <div className="md:w-[400px] w-full flex justify-center items-center pb-24">
            {submitted ? (
              <>
                <div className="flex flex-col justify-center items-center px-2">
                  <p className="text-2xl text-neutral-200">Kort skapat!</p>

                  <p className="text-lg text-neutral-400 pt-8">
                    Kod: {card.code}
                  </p>

                  <button
                    onClick={() => setSubmitted(false)}
                    className="bg-gradient-to-br from-pink-600 hover:from-pink-700 hover:to-violet-800 to-violet-700 py-4 px-12 rounded-lg text-xl text-neutral-200 cursor-pointer mt-8"
                  >
                    Skapa nytt kort
                  </button>
                </div>
              </>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-2 w-full px-4"
              >
                <p className="text-center text-neutral-200 text-4xl md:text-5xl mb-6">
                  Nytt medlemskort
                </p>
                <input
                  type="text"
                  placeholder="Namn"
                  name="cardName"
                  {...register("cardName", {
                    required: "Du måste ge kortet ett namn",
                  })}
                  className="py-4 pl-4 text-xl"
                />
                <input
                  type="text"
                  placeholder="Kod"
                  name="code"
                  {...register("code", { required: "Du måste ange en kod" })}
                  className="py-4 pl-4 text-xl"
                />
                <input
                  type="number"
                  placeholder="Antal"
                  name="amount"
                  {...register("amount", {
                    required: "Du måste ange ett antal",
                  })}
                  className="py-4 pl-4 text-xl"
                />
                <input
                  type="submit"
                  value="Skapa kort"
                  className="bg-gradient-to-br from-pink-600 hover:from-pink-700 hover:to-violet-800 to-violet-700 py-4 rounded-lg text-xl text-neutral-200 cursor-pointer mt-2"
                />
              </form>
            )}
          </div>
          <button className="p-4 bg-teal-300" onClick={activateCard}>
            Activate
          </button>
          <div className="bg-gradient-to-t from-pink-900 to-slate-900 w-full flex flex-col gap-6 justify-start items-center pt-12 pb-24">
            <p className="md:text-5xl text-4xl text-neutral-300 mt-12 mb-8">
              Dina kort
            </p>
            {currentCards ? (
              currentCards.map((card, index) => (
                <div
                  key={index}
                  className="flex justify-between bg-gradient-to-br from-pink-600 to-violet-700 shadow-md md:w-[300px] w-[80vw] px-4 py-6 rounded-2xl"
                  onClick={() => toggleEdit(card)}
                >
                  <div>
                    <p className="text-2xl text-neutral-100">{card.cardName}</p>
                    <p className="mt-2 text-neutral-400">
                      Aktiverade: {card.used}
                    </p>
                    <p className="text-neutral-400">Max antal: {card.amount}</p>
                    <p className="text-neutral-400">Kod: {card.code}</p>
                  </div>
                  <div>
                    {" "}
                    <Pen width={35} height={35} fill="#d57187" className="" />
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="bg-red-400">nej</div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
