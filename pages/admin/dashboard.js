import React, { useEffect, useState } from "react";

import Router from "next/router";
import axios from "axios";
import TestCalendar from "../../components/TestCalendar";
import dayjs from "dayjs";
import dayOfYear from "dayjs/plugin/dayOfYear";
import isoWeek from "dayjs/plugin/isoWeek";

import FilterButton from "../../components/FilterButton";
import SalesCard from "../../components/SalesCard";

import styles from "../../styles/Dashboard.module.css";
import Add from "../../components/svg-components/Add";
import Ticket from "../../components/svg-components/Ticket";
import Chat from "../../components/svg-components/Chat";
import Download from "../../components/svg-components/Download";
import { Auth } from "aws-amplify";
import { Amplify } from "aws-amplify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

dayjs.extend(dayOfYear);
dayjs.extend(isoWeek);

export default function Dashboard() {
  const [dates, setDates] = useState([]);
  const [user, updateUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [allEvents, setAllEvents] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [isLoading, setIsLoading] = useState();

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        console.log("User: ", user);
        updateUser(user);
      })
      .catch((err) => updateUser(null));
  }, []);



  const getAllEvents = async () => {
    if(!allEvents){

      const events = await axios
      .get(
        "https://47yon8pxx3.execute-api.eu-west-2.amazonaws.com/rouge-api/get-events"
      );
      setAllEvents(events.data);
      return;
    }
    console.log("We have events already")
    console.log(allEvents);
  };

  getAllEvents();


  console.log(dayjs().isoWeek());

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <div className="grid grid-cols-1 min-h-screen bg-slate-800">
      <h1 className="text-4xl text-neutral-300 font-medium pl-2 pt-10">
        Välkommen {user && capitalizeFirstLetter(user.username)}
      </h1>
      <div className="pt-10 pb-10">
        <h2 className="text-2xl pl-2 pb-4 text-neutral-500">Vad vill du göra idag?</h2>
        <div className={styles.mediaScroller}>
          <div
            className="text-center flex flex-col justify-center items-center bg-neutral-100 py-10 rounded-md shadow-md gap-2 text-neutral-600 mr-4 flex-1"
            onClick={() => Router.push("/admin/tickets/your-tickets")}
          >
            <Add width="35px" height="35px" fill="rgb(38 38 38)" />
            <p>Skapa event</p>
          </div>
          {/* <div
            className="text-center flex flex-col justify-center items-center bg-neutral-100 py-10 rounded-md shadow-md gap-2 text-neutral-600 mr-4 flex-1"
            onClick={() => Router.push("/admin/dashboard")}
          >
            <Ticket width="35px" height="35px" fill="rgb(38 38 38)" />
            <p>Släppa biljetter</p>
          </div> */}
          <div className="text-center flex flex-col justify-center items-center bg-neutral-100 py-10 rounded-md shadow-md gap-2 text-neutral-600 mr-4 flex-1">
            <Chat width="35px" height="35px" fill="rgb(38 38 38)" />
            <p>Skicka notis</p>
            <p className="text-sm">Inte klart</p>
          </div>
          <div className="text-center flex flex-col justify-center items-center bg-neutral-100 py-10 rounded-md shadow-md gap-2 text-neutral-600 mr-4 flex-1">
            <Download width="35px" height="35px" fill="rgb(38 38 38)" />
            <p>Ladda ner rapport</p>
            <p className="text-sm">Inte klart</p>
          </div>
        </div>
      </div>

      <div className=" bg-slate-800 pb-10 px-4">
        <h2 className="text-3xl text-neutral-500 text-center py-8">Schema (inte klart än)</h2>
        <TestCalendar allEvents={allEvents}/>
      </div>
      <div className="text-center mb-8">
        <button
          onClick={() => signOut({ callbackUrl: "http://localhost:3000/" })}
          className="bg-red-300 py-4 px-8 rounded-md shadow-md mt-8 w-10 h-14 w-40"
        >
          Logga ut
        </button>
      </div>
    </div>
  );
}
