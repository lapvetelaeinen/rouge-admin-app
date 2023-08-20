import BackButton from "../BackButton";
import RougeButton from "../RougeButton";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

export default function CreateTicketsModal({ goBack, eventId }) {
  const [isNewTicketActive, setIsNewTicketActive] = useState(false);

  const router = useRouter();

  console.log("id from server: ", eventId);

  const {
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const toggleNewTicket = () => {
    reset();
    setIsNewTicketActive(!isNewTicketActive);
  };

  const onSubmit = async (data) => {
    const payload = {
      type: "createTicket",
      event: {
        pk: eventId,
        sk: data.ticketClass,
        price: data.price,
        maxAmount: data.amount,
        info: data.info,
      },
    };

    const lambdaResponse = await fetch("/api/aws", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const msg = await lambdaResponse.json();

    console.log("Message: ", msg);

    reset();
    router.reload();
  };

  return (
    <>
      <div className="min-h-screen">
        <BackButton action={goBack} />
        <h1 className="md:text-5xl text-center text-4xl font-bold text-neutral-600 mb-8 mt-2">
          Biljetter
        </h1>
        {isNewTicketActive ? (
          <div className="flex flex-col px-4">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-2"
            >
              <input
                autoComplete="off"
                className="py-4 pl-4 text-2xl bg-neutral-100 shadow-inner"
                type="text"
                placeholder="Biljettklass"
                {...register("ticketClass", { required: true, maxLength: 80 })}
              />
              <input
                autoComplete="off"
                className="py-4 pl-4 text-2xl bg-neutral-100 shadow-inner"
                type="number"
                placeholder="Pris"
                {...register("price", { required: true, maxLength: 80 })}
              />
              <input
                autoComplete="off"
                className="py-4 pl-4 text-2xl bg-neutral-100 shadow-inner"
                type="number"
                placeholder="Antal"
                {...register("amount", { required: true, maxLength: 80 })}
              />
              <textarea
                autoComplete="off"
                rows={5}
                className="py-4 pl-4 text-2xl bg-neutral-100 shadow-inner"
                type="text"
                placeholder="Info"
                {...register("info", { maxLength: 100 })}
              />

              <input
                type="submit"
                value="Skapa biljett"
                className="bg-purple-500 text-white drop-shadow-md py-5 text-2xl rounded-full mb-2 mt-6"
              />
              <RougeButton
                type="secondary"
                text="Avbryt"
                action={toggleNewTicket}
              />
            </form>
          </div>
        ) : (
          <div className="flex flex-col px-4">
            <RougeButton
              type="main"
              text="Ny biljettklass"
              action={toggleNewTicket}
            />
          </div>
        )}
      </div>
    </>
  );
}
