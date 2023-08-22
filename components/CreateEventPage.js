import BackButton from "./BackButton";
import RougeButton from "./RougeButton";
import Image from "next/image";
import Router from "next/router";
import ImageIcon from "./svg-components/Image";
import TempImage from "./TempImage";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import PlaceholderImage from "../public/party.jpg";
import "react-datepicker/dist/react-datepicker.css";

export default function CreateEventPage({ toggleActive }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedImage, setSelecetedImage] = useState(null);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const watchFile = watch("file", null);

  const goBack = () => {
    toggleActive();
  };

  const chooseFile = (e) => {
    e.preventDefault();

    const el = document.getElementById("image");
    el.click();
  };

  const onSubmit = async (data) => {
    const file = data.file[0];
    console.log("File type: ", file.type);
    console.log("File: ", file);

    // //create presigned url from s3
    // const { url } = await fetch("/api/s3/upload-image").then((res) =>
    //   res.json()
    // );

    //create presigned url from s3
    const res = await fetch("/api/s3/upload-image", {
      method: "POST",
      body: JSON.stringify({ type: file.type }),
    });

    const { url } = await res.json();

    //upload the image to s3
    await fetch(url, {
      method: "PUT",
      headers: {
        "Content-type": file.type,
        "Access-Control-Allow-Origin": "*",
      },
      body: file,
    });

    const imageUrl = url.split("?")[0];
    console.log("uploaded image: ", imageUrl);

    //generate unique id for event

    function generateUniqueId() {
      const timestamp = new Date().getTime(); // Current timestamp
      const randomPart = Math.random().toString(36).substring(2, 10); // Random string

      const uniqueId = `${timestamp}-${randomPart}`;
      return uniqueId;
    }

    const eventId = generateUniqueId();

    const payload = {
      type: "createEvent",
      event: {
        eventName: data.name,
        info: data.info,
        date: selectedDate,
        image: imageUrl,
        eventId: eventId,
      },
    };

    //create the event and store in db

    const lambdaResponse = await fetch("/api/aws", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const msg = await lambdaResponse.json();

    //Could do this on aws...
    await fetch("/api/trigger-revalidation?path=/");

    const id = msg.eventId;

    Router.push("/admin/create-event/event/" + id);
  };

  useEffect(() => {
    if (watchFile) {
      setSelecetedImage(watchFile[0]);
    }
    console.log(selectedImage);
  });

  return (
    <>
      <div className="pt-2 pb-24">
        <BackButton action={goBack} />
        <h1 className="md:text-5xl text-center text-4xl font-bold text-neutral-600 mb-8 mt-6">
          Skapa nytt event
        </h1>
        <div onClick={chooseFile} className="p-4">
          {selectedImage ? (
            <TempImage selectedImage={selectedImage} />
          ) : (
            <div className="relative w-full h-[350px] flex flex-col gap-4 justify-center items-center rounded-2xl overflow-clip drop-shadow-md bg-neutral-100">
              <ImageIcon
                width="80px"
                height="80px"
                fill="#d6d3d1"
                className=""
              />
              <p className="text-xl text-neutral-400">Välj bild</p>
            </div>
          )}
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-2 px-4"
        >
          <input
            autoComplete="off"
            className="py-4 pl-4 text-2xl bg-neutral-100 shadow-inner"
            type="text"
            placeholder="Titel"
            {...register("name", { required: true, maxLength: 80 })}
          />
          <textarea
            autoComplete="off"
            rows={5}
            className="py-4 pl-4 text-2xl bg-neutral-100 shadow-inner"
            type="text"
            placeholder="Info"
            {...register("info")}
          />

          <DatePicker
            className="bg-purple-100 rounded-md p-4 text-neutral-700 text-xl shadow-sm w-full mb-6"
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
          />

          <input
            className="hidden"
            id="image"
            type="file"
            accept="image/*"
            {...register("file")}
          />

          <input
            type="submit"
            value="Skapa event"
            className="bg-purple-500 text-white drop-shadow-md py-5 text-2xl rounded-full mb-2"
          />
          <RougeButton type="secondary" text="Avbryt" action={goBack} />
        </form>
        {uploadedImage ? (
          <Image
            src={uploadedImage}
            width={50}
            height={50}
            alt="user generated image"
          />
        ) : null}
      </div>
    </>
  );
}
