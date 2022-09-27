import { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";
import EventListTile from "../../../components/EventListTile";
import Loader from "../../../components/Loader";
import Times from "../../../components/svg-components/Times";
import { useRouter } from "next/router";

export default function CreateTickets() {
  const [allEvents, setAllEvents] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(null);
  const [file, setFile] = useState();

  const router = useRouter();

  const deleteEvent = async () => {
    const params = {
      eventName: selectedEvent.eventName,
      eventDate: selectedEvent.eventDate,
    };
    setIsLoading(true);
    await axios.post(
      "https://47yon8pxx3.execute-api.eu-west-2.amazonaws.com/rouge-api/delete-event",
      params
    );
    setIsLoading(false);
    setShowDeleteModal(false);
    getAllEvents();

  };

  const {
    reset,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const getAllEvents = async () => {
    const events = await axios
    .get(
      "https://47yon8pxx3.execute-api.eu-west-2.amazonaws.com/rouge-api/get-events"
    );
    setAllEvents(events.data);
  }

  useEffect(() => {
    if (!allEvents) {
      axios
        .get(
          "https://47yon8pxx3.execute-api.eu-west-2.amazonaws.com/rouge-api/get-events"
        )
        .then((res) => setAllEvents(res.data));
      console.log("this is events: ", allEvents);
    }
    return;
  });

  const addEvent = async (params) => {
    setIsLoading(true);
    await axios.post(
      "https://47yon8pxx3.execute-api.eu-west-2.amazonaws.com/rouge-api/create-event",
      params
    );
    setIsLoading(false);
    getAllEvents();
  };

  const onSubmit = async (data) => {
    // User uploaded file
    if (file) {
      // Send a request to upload to the S3 Bucket.
      try {
        uploadFile();

        // await Storage.put(imagePath, file, {
        //   contentType: file.type, // contentType is optional
        // });

        const createNewEventInput = {
          eventName:
            data.title.replace(/\s+/g, "-").toLowerCase(),
          eventDate: selectedDate.toISOString().substring(0, 10),
          image: file.name,
          description: data.description,
        };

        addEvent(createNewEventInput);
        // const createNewEvent = await API.graphql({
        //   query: createEvent,
        //   variables: { input: createNewEventInput },
        //   authMode: "AMAZON_COGNITO_USER_POOLS",
        // });

        console.log("New event created successfully:", createNewEventInput);

        reset();
        setShowModal(false);
        getAllEvents();

        // router.push(`/admin/dashboard`);
      } catch (error) {
        console.error("Error uploading file: ", error);
      }
    } else {
      const createNewEventWithoutImageInput = {
        eventName: data.title,
        eventDate: selectedDate.toISOString().substring(0, 10),
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
    setFile(null);
  };
  return (
    <>
      <div className="bg-slate-800 min-h-screen">
        {isLoading && <Loader/>}
        {showModal ? (
          <div className="">
            <div
              className="bg-neutral-800 z-40 absolute h-full w-full flex justify-center items-center bg-opacity-80"
              onClick={() => setShowModal(false)}
            ></div>
            <div className="absolute bg-neutral-200 z-50 w-full min-h-[300px rounded-3xl p-4 mt-40">
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

                  <div className="p-4 bg-neutral-100 placeholder-neutral-700 text-neutral-900 rounded-md shadow-sm">
                    <p>Ladda upp en bild</p>
                    <input type="file" onChange={(e) => selectFile(e)} />
                  </div>

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
                    className="p-4 bg-[#d57187] placeholder-neutral-700 text-neutral-700 rounded-md shadow-sm"
                    value="Skapa"
                  />
                </form>
              </div>
            </div>
          </div>
        ) : null}
        {showDeleteModal ? (
          <div className="">
            <div
              className="bg-neutral-800 z-40 absolute h-full w-full flex justify-center items-center bg-opacity-80"
              onClick={() => setShowDeleteModal(false)}
            ></div>
            <div className="absolute bg-neutral-200 z-50 w-full min-h-[300px rounded-3xl p-4 mt-40">
              <div className="flex flex-col">
                <div className="flex justify-between p-1">
                  <p></p>
                  <Times
                    width={50}
                    height={50}
                    fill="#f57971"
                    onClick={() => setShowDeleteModal(!showDeleteModal)}
                  />
                </div>
                <div className="px-10">
                  <p className="text-xl text-center pt-4">
                    Är du säker på att du vill radera detta event?
                  </p>
                  <div className="flex justify-center gap-8 pt-8 pb-4">
                    <button
                      className="border-2 border-neutral-500 rounded-md text-md text-neutral-700 py-3 px-6"
                      onClick={() => setShowDeleteModal(false)}
                    >
                      Behåll
                    </button>
                    <button
                      className="bg-red-400 shadow-md rounded-md text-md py-3 px-6"
                      onClick={(e) => deleteEvent(e)}
                    >
                      Radera
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        <div className="pt-14 pb-20">
          <h1 className="text-center text-4xl text-violet-300 font-bold">
            Biljettsläpp?
          </h1>
          <p className="text-center pt-6 px-4 text-neutral-500">
            Välj ett event från listan för att lägga till nya biljetter eller
            klicka på knappen längst ned för att skapa nytt event.
          </p>
        </div>
        <p className="pl-4 pb-4 text-3xl font-bold text-violet-300">
          Dina events
        </p>
        <div className="flex flex-col gap-4">
          {allEvents
            ? allEvents.map((event) => (
                <div key={event.eventName}>
                  <EventListTile
                    key={event.eventName}
                    id={event.eventName}
                    event={event}
                    toggle={() => setShowDeleteModal(!showDeleteModal)}
                    setSelectedEvent={(e) => setSelectedEvent(e)}
                  />
                </div>
              ))
            : null}
        </div>
        <div className="px-2">
          <button
            className="bg-[#d57187] w-full p-5 text-xl rounded-lg mt-8 text-neutral-700"
            onClick={() => setShowModal(true)}
          >
            Nytt event
          </button>
        </div>
      </div>
    </>
  );
}
