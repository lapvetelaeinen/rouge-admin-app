import { useRouter } from "next/router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

export default function Create() {
  const router = useRouter();
  const [uploadingStatus, setUploadingStatus] = useState();
  const [uploadedFile, setUploadedFile] = useState();
  const [file, setFile] = useState();

  const [selectedDate, setSelectedDate] = useState(new Date());

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
        };

        addEvent(createNewEventInput);
        // const createNewEvent = await API.graphql({
        //   query: createEvent,
        //   variables: { input: createNewEventInput },
        //   authMode: "AMAZON_COGNITO_USER_POOLS",
        // });

        console.log("New event created successfully:", createNewEvent);

        router.push(`/`);
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
    <main className="bg-neutral-800">
      <div className="bg-orange-300">
        <p>Please select a file to upload</p>
        <input type="file" onChange={(e) => selectFile(e)} />
        {file && (
          <>
            <p>Selected file: {file.name}</p>
            <button
              onClick={uploadFile}
              className=" bg-purple-500 text-white p-2 rounded-sm shadow-md hover:bg-purple-700 transition-all"
            >
              Upload a File!
            </button>
          </>
        )}
        {uploadingStatus && <p>{uploadingStatus}</p>}
        {uploadedFile && <img src={uploadedFile} />}
      </div>
      <div className="p-4">
        <h1 className="pb-8 text-2xl text-violet-300">
          Skapa ett nytt evenemang
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
          className="flex flex-col"
        >
          <input
            type="text"
            placeholder="Titel"
            name="title"
            {...register("title")}
          />

          <DatePicker
            className="bg-violet-200 rounded-md p-4 border-2 border-violet-300"
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
          />

          <input
            type="text"
            placeholder="Beskrivning"
            name="description"
            {...register("description")}
          />

          <label>
            Sälj biljetter?
            <select name="ticket">
              <option value="ja">Ja</option>
              <option value="nej">Nej</option>
            </select>
          </label>

          <input
            type="number"
            name="amount"
            placeholder="Antal"
            {...register("amount")}
          />

          <input
            type="number"
            name="price"
            placeholder="Pris"
            {...register("price")}
          />
          <input type="submit" className="bg-orange-600" />
        </form>
      </div>
    </main>
  );
}
