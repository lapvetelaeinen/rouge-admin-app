import { useRouter } from "next/router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import Times from "../../components/svg-components/Times";

export default function Create() {
  const router = useRouter();
  const [uploadingStatus, setUploadingStatus] = useState();
  const [uploadedFile, setUploadedFile] = useState();
  const [file, setFile] = useState();
  const [showModal, setShowModal] = useState(false);

  const [selectedDate, setSelectedDate] = useState(new Date());

  const openModal = () => {
    setShowModal(!showModal);
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const addEvent = async (params) => {
    await axios.put("/api/item", params);
  };

  const onSubmit = async (data) => {
    console.log(file);
    console.log(data);

    openModal();

    const rawTickets = [
      { class: data.ticketclass, price: data.price, amount: data.amount },
    ];

    console.log(rawTickets);

    // User uploaded file
    if (file) {
      // Send a request to upload to the S3 Bucket.
      try {
        uploadFile();

        // await Storage.put(imagePath, file, {
        //   contentType: file.type, // contentType is optional
        // });

        const createNewEventInput = {
          title: data.title,
          image: file.name,
          date: selectedDate,
          description: data.description,
          tickets: [],
        };

        addEvent(createNewEventInput);
        // const createNewEvent = await API.graphql({
        //   query: createEvent,
        //   variables: { input: createNewEventInput },
        //   authMode: "AMAZON_COGNITO_USER_POOLS",
        // });

        console.log("New event created successfully:", createNewEventInput);

        // router.push(`/admin/dashboard`);
      } catch (error) {
        console.error("Error uploading file: ", error);
      }
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
              <h2 className="text-xl text-center mb-4">Snyggt!</h2>
              <p className="text-center text-neutral-600 mb-4">
                Vill du släppa biljetter till detta event? <br /> Du kan också
                välja att göra detta senare.
              </p>
              <div className="mx-5">
                <button
                  className="bg-violet-400 w-full text-2xl font-steelfish text-neutral-700 rounded-lg py-6 shadow-lg"
                  onClick={() => router.push("/admin/add-tickets")}
                >
                  Släpp biljetter
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <div className="pt-14 pb-20">
        <h1 className="text-4xl text-center text-neutral-700 font-bold">
          Skapa event
        </h1>
        <p className="text-center pt-6 px-4 text-neutral-500">
          Håll era gäster uppdaterade genom att skapa nya events som automatiskt
          visas på er hemsida. Vill du göra ändringar på ett event så kan du
          klicka på ett av eventen i listan.
        </p>
      </div>

      <div className="bg-violet-200 rounded-lg shadow-md p-4 mx-2 mt-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
          className="flex flex-col gap-3"
        >
          <input
            type="text"
            placeholder="Titel"
            name="title"
            {...register("title")}
            className="p-4 bg-neutral-100 placeholder-neutral-700 text-neutral-900 rounded-md shadow-sm"
          />

          <DatePicker
            className="bg-neutral-100 rounded-md p-4 text-neutral-700 shadow-sm w-full"
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
          />

          <input
            type="text"
            placeholder="Beskrivning"
            name="description"
            {...register("description")}
            className="p-4 bg-neutral-100 placeholder-neutral-700 text-neutral-900 rounded-md shadow-sm"
          />

          {/*
          image upload causes problem with display on mobile
          */}

          <div className="p-4 bg-neutral-100 placeholder-neutral-700 text-neutral-900 rounded-md shadow-sm">
            <p>Ladda upp en bild</p>
            <input type="file" onChange={(e) => selectFile(e)} />
          </div>
          {/* <label>
            Sälj biljetter?
            <select name="ticket">
              <option value="ja">Ja</option>
              <option value="nej">Nej</option>
            </select>
          </label> */}

          {/* <input
            type="number"
            name="amount"
            placeholder="Antal"
            {...register("amount")}
            className="p-4 bg-violet-300 placeholder-neutral-700 text-neutral-900 rounded-md shadow-sm"
          />

          <input
            type="number"
            name="price"
            placeholder="Pris"
            {...register("price")}
            className="p-4 bg-violet-300 placeholder-neutral-700 text-neutral-900 rounded-md shadow-sm"
          /> */}

          <input
            type="hidden"
            placeholder="Biljettklass"
            name="ticketclass"
            {...register("ticketclass")}
            className="p-4 bg-neutral-100 placeholder-neutral-700 text-neutral-900 rounded-md shadow-sm"
          />

          <input
            type="hidden"
            placeholder="Pris"
            name="price"
            {...register("price")}
            className="p-4 bg-neutral-100 placeholder-neutral-700 text-neutral-900 rounded-md shadow-sm"
          />

          <input
            type="hidden"
            placeholder="Antal"
            name="amount"
            {...register("amount")}
            className="p-4 bg-neutral-100 placeholder-neutral-700 text-neutral-900 rounded-md shadow-sm"
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
