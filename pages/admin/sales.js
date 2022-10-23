import { useRouter } from "next/router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import Times from "../../components/svg-components/Times";
import Select from "react-select";
import { EKS } from "aws-sdk";

export default function Sales() {
  const router = useRouter();
  const [allEvents, setAllEvents] = useState(null);
  const [sales, setSales] = useState();
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
      eventName: "test"
    };

    await axios
    .post(
      "https://47yon8pxx3.execute-api.eu-west-2.amazonaws.com/rouge-api/get-event-sales-report", params
    )
    .then((res) => {
        const salesReport = res.data;
        setSales(salesReport);
    });

  }

  useEffect(() => {
    let fetchedEvents;

    const getSales = async () => {
  
      const params = {
        eventName: "test"
      };
  
      await axios
      .post(
        "https://47yon8pxx3.execute-api.eu-west-2.amazonaws.com/rouge-api/get-event-sales-report", params
      )
      .then((res) => {
          const salesReport = res.data;
          setSales(salesReport);
      });
  
    }
    
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

        getSales();
        return;
    }
    if (allEvents) {
      return;
    }
    return;
  });

  return (
    <div className="min-h-screen w-full bg-neutral-100 px-4">
      <div className="pt-14 pb-20">
        <h1 className="text-4xl text-center text-neutral-700 font-bold">
          Ha koll på er försäljning
        </h1>

      {/* <Controller
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
      </small> */}
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {sales ? sales.map(el => <div key={el.eventName + el.ticketClass} className="p-4 bg-neutral-300">
        <p className="">{el.eventName}</p>
        <p>{el.ticketClass}</p>
        <p>{el.soldTickets} ST</p>
        <p>{el.revenue} SEK</p>
        </div>) : "Laddar..."}
      </div>
    </div>
  );
}
