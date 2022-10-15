import { useRouter } from "next/router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import Times from "../../components/svg-components/Times";
import Select from "react-select";

export default function Sales() {
  const router = useRouter();
  const [allEvents, setAllEvents] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data);
  };

  const selectOptions = [{ value: "lala", label: "lala" }];


  
  const handleChange = async (selectedOption) => {
    setSelectedEvent(selectedOption.value);

    const params = {
      eventName: selectedOption.value
    };

    await axios
    .post(
      "https://47yon8pxx3.execute-api.eu-west-2.amazonaws.com/rouge-api/get-event-sales-report", params
    )
    .then((res) => {
        const salesReport = res.data;
        console.log(salesReport);
    });

  }

  useEffect(() => {
    let fetchedEvents;
    
    if (!allEvents) {
      axios
        .get(
          `https://47yon8pxx3.execute-api.eu-west-2.amazonaws.com/rouge-api/get-events`
        )
        .then((res) => {
            let allEventsArr = []
            res.data.forEach((el) => {
                allEventsArr.push({value: el.eventName, label: el.eventName});
            });
            setAllEvents(allEventsArr);
        });
    }
    if (allEvents) {
      console.log(allEvents);
    }
    return;
  });

  return (
    <div className="min-h-screen w-full bg-neutral-100 px-4">
      <div className="pt-14 pb-20">
        <h1 className="text-4xl text-center text-neutral-700 font-bold">
          Ha koll på er försäljning
        </h1>
        <p className="text-center pt-6 px-4 text-neutral-500">
          Välj event nedan för att se er försäljning.
        </p>
      <Controller
        name="role"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <Select
            options={
              allEvents ? allEvents : selectOptions
            }
            placeholder="Välj event..."
            onChange={handleChange}
          />
        )}
      />
      <small className="text-danger">
        {errors?.role && errors.role.message}
      </small>
      </div>
    </div>
  );
}
