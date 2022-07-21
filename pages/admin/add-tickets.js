import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

export default function AddTickets() {
  const router = useRouter();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const addTicket = async (params) => {
    await axios.post("/api/addticket", params);
  };

  const onSubmit = async (data) => {
    console.log(data);

    const newTicket = [
      { class: data.ticketclass, price: data.price, amount: data.amount },
    ];

    // User uploaded file
    if (data) {
      // Send a request to upload to the S3 Bucket.

      // await Storage.put(imagePath, file, {
      //   contentType: file.type, // contentType is optional
      // });

      const createNewTicketInput = {
        ticket: newTicket,
      };

      addTicket(createNewTicketInput);
      // const createNewEvent = await API.graphql({
      //   query: createEvent,
      //   variables: { input: createNewEventInput },
      //   authMode: "AMAZON_COGNITO_USER_POOLS",
      // });

      console.log("New ticket created successfully:", createNewTicketInput);

      // router.push(`/admin/dashboard`);
    } else {
      const createNewEventWithoutImageInput = {
        title: data.title,
        date: selectedDate,
        amount: data.amount,
        price: data.price,
        description: data.description,
      };

      const createNewEventWithoutImage = await API.graphql({
        query: createEvent,
        variables: { input: createNewEventWithoutImageInput },
        authMode: "AMAZON_COGNITO_USER_POOLS",
      });

      router.push(`/event/${createNewEventWithoutImage.data.createEvent.id}`);
    }
  };

  // Image upload below

  const selectFile = (e) => {
    setFile(e.target.files[0]);
  };

  const BUCKET_URL = "https://rouge-event-images.s3.eu-west-2.amazonaws.com/";

  const uploadFile = async () => {
    setUploadingStatus("Uploading the file to AWS S3");

    const imagePath = uuidv4();

    let { data } = await axios.post("/api/s3/uploadFile", {
      name: file.name,
      type: file.type,
    });

    console.log(data);

    const url = data.url;

    console.log(url);

    await axios.put(url, file, {
      headers: {
        "Content-type": file.type,
        "Access-Control-Allow-Origin": "*",
      },
    });

    setUploadedFile(BUCKET_URL + file.name);
    setFile(null);
  };

  return (
    <div className="min-h-screen w-full bg-orange-100">
      <h1 className="pb-8 text-4xl text-violet-800 pl-2">
        Skapa nya biljetter
      </h1>

      <div className="bg-orange-200 rounded-lg shadow-md">
        <form
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
          className="flex flex-col gap-3"
        >
          <input
            type="text"
            placeholder="Biljettklass"
            name="ticketclass"
            {...register("ticketclass")}
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
            name="amount"
            {...register("amount")}
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
  );
}
