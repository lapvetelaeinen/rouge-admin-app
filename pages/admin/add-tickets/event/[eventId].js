import { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";
import EventListTile from "../../components/EventListTile";
import Loader from "../../components/Loader";
import Times from "../../components/svg-components/Times";
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
    const events = await axios.get(
      "https://47yon8pxx3.execute-api.eu-west-2.amazonaws.com/rouge-api/get-events"
    );
    setAllEvents(events.data);
  };

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

    await axios({
      method: "post",
      url: "https://rouge-admin-app.vercel.app/api/revalidate-event?secret=gkmn12714",
      headers: {},
      data: {
        slugToRevalidate: params.eventName, // This is the body part
      },
    });

    await axios({
      method: "post",
      url: "https://rouge-site.vercel.app/api/revalidate-event?secret=gkmn12714",
      headers: {},
      data: {
        slugToRevalidate: params.eventName, // This is the body part
      },
    });
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

        const removedSpaces = data.title.replace(/\s+/g, "-").toLowerCase();
        const eventName = removedSpaces
          .replace(/å/g, "_aa_")
          .replace(/Å/g, "_AA_")
          .replace(/ä/g, "_ae_")
          .replace(/Ä/g, "_AE_")
          .replace(/ö/g, "_oe_")
          .replace(/Ö/g, "_OE_");

        const createNewEventInput = {
          eventName: eventName,
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
        <h1 className="md:text-5xl text-4xl font-bold text-neutral-200">
          Hantera biljetter
        </h1>
      </div>
    </>
  );
}
