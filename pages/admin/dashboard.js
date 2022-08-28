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
  const [allTickets, setAllTickets] = useState(null);
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

  async function getTickets() {
    const tickets = await axios.get(
      "https://w8rzbuwc73.execute-api.eu-west-2.amazonaws.com/salesinfo/rouge-sales-info"
    );
    setAllTickets(tickets.data.Items);

    let selectedTickets = [];
    let totalRevenue = 0;

    let date = selectedDate;
    let newDate = date.toISOString().split("T")[0];

    tickets.data.Items.map((ticket) => {
      if (ticket.date === newDate && ticket.paymentStatus === "PAID") {
        selectedTickets.push(ticket);
        const paidAmount = parseInt(ticket.amount);
        totalRevenue += paidAmount;
        return;
      }
      return;
    });
    setAllTickets(selectedTickets);
    setRevenue(totalRevenue);
    setIsLoading(false);
  }

  useEffect(() => {
    setIsLoading(true);
    getTickets();
  }, [selectedDate]);

  // useEffect(() => {
  //   let selectedTickets;

  //   allTickets.map((ticket) => {
  //     console.log(ticket.owner);
  //   });
  // }, [selectedDate]);

  console.log(dayjs().isoWeek());

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <div className="grid grid-cols-1 min-h-screen bg-orange-100">
      <h1 className="text-4xl font-medium pl-2 pt-10">
        Välkommen {user && capitalizeFirstLetter(user.username)}
      </h1>
      <div className="pt-10 pb-10">
        <h2 className="text-2xl pl-2 pb-4">Vad vill du göra idag?</h2>
        <div className={styles.mediaScroller}>
          <div
            className="text-center flex flex-col justify-center items-center bg-neutral-100 py-10 rounded-md shadow-md gap-2 text-neutral-600 mr-4 flex-1"
            onClick={() => Router.push("/admin/dashboard")}
          >
            <Add width="35px" height="35px" fill="rgb(38 38 38)" />
            <p>Skapa event</p>
          </div>
          <div
            className="text-center flex flex-col justify-center items-center bg-neutral-100 py-10 rounded-md shadow-md gap-2 text-neutral-600 mr-4 flex-1"
            onClick={() => Router.push("/admin/dashboard")}
          >
            <Ticket width="35px" height="35px" fill="rgb(38 38 38)" />
            <p>Släppa biljetter</p>
          </div>
          <div className="text-center flex flex-col justify-center items-center bg-neutral-100 py-10 rounded-md shadow-md gap-2 text-neutral-600 mr-4 flex-1">
            <Chat width="35px" height="35px" fill="rgb(38 38 38)" />
            <p>Skicka notis</p>
          </div>
          <div className="text-center flex flex-col justify-center items-center bg-neutral-100 py-10 rounded-md shadow-md gap-2 text-neutral-600 mr-4 flex-1">
            <Download width="35px" height="35px" fill="rgb(38 38 38)" />
            <p>Ladda ner rapport</p>
          </div>
        </div>
      </div>
      <div className="bg-violet-200">
        <h2 className="text-3xl text-neutral-800 text-center pt-8">
          Försäljning
        </h2>
        {isLoading ? <p>Laddar...</p> : null}
        <div className="pb-10 pt-8">
          <div className="px-4 flex justify-between">
            <div>
              <DatePicker
                className="bg-neutral-200 rounded-md p-4 text-neutral-700 shadow-sm w-[30vw]"
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
              />
            </div>
          </div>
          <div className={styles.salesScroller}>
            <SalesCard
              type="Totalt"
              tickets={allTickets ? allTickets.length + " st" : null}
              cash={revenue ? revenue + " SEK" : null}
            />
          </div>
        </div>
      </div>
      <div className=" bg-orange-100 pb-10 px-4">
        <h2 className="text-3xl text-neutral-800 text-center py-8">Schema</h2>
        <TestCalendar />
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
