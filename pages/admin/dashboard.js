import React, { useEffect, useState } from "react";

import Router from "next/router";

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

dayjs.extend(dayOfYear);
dayjs.extend(isoWeek);

export default function Dashboard() {
  const [dates, setDates] = useState([]);
  const [user, updateUser] = useState(null);

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        console.log("User: ", user);
        updateUser(user);
      })
      .catch((err) => updateUser(null));
  }, []);

  // const omfg = () => {
  //   const today = dayjs().dayOfYear();
  //   const newDates = [...dates];

  //   for (let i = today; i < today + 30; i++) {
  //     const date = dayjs("2022-01-01").dayOfYear(i);
  //     newDates.push(date.date());
  //     console.log(newDates);
  //   }

  //   setDates(newDates);
  //   console.log(dates);
  // };

  console.log(dayjs().isoWeek());

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 min-h-screen bg-orange-100">
      <h1 className="text-4xl font-medium pl-2 pt-10">
        Välkommen {user && capitalizeFirstLetter(user.username)}
      </h1>
      <div className="pt-10 pb-10">
        <h2 className="text-2xl pl-2 pb-4">Vad vill du göra idag?</h2>
        <div className={styles.mediaScroller}>
          <div
            className="text-center flex flex-col justify-center items-center bg-neutral-100 py-10 rounded-md shadow-md gap-2 text-neutral-600 mr-4"
            onClick={() => Router.push("/admin/create")}
          >
            <Add width="35px" height="35px" fill="rgb(38 38 38)" />
            <p>Skapa event</p>
          </div>
          <div className="text-center flex flex-col justify-center items-center bg-neutral-100 py-10 rounded-md shadow-md gap-2 text-neutral-600 mr-4">
            <Ticket width="35px" height="35px" fill="rgb(38 38 38)" />
            <p>Släppa biljetter</p>
          </div>
          <div className="text-center flex flex-col justify-center items-center bg-neutral-100 py-10 rounded-md shadow-md gap-2 text-neutral-600 mr-4">
            <Chat width="35px" height="35px" fill="rgb(38 38 38)" />
            <p>Skicka notis</p>
          </div>
          <div className="text-center flex flex-col justify-center items-center bg-neutral-100 py-10 rounded-md shadow-md gap-2 text-neutral-600 mr-4">
            <Download width="35px" height="35px" fill="rgb(38 38 38)" />
            <p>Ladda ner rapport</p>
          </div>
        </div>
      </div>
      <div className="bg-orange-200">
        <h2 className="text-3xl text-neutral-800 text-center pt-8">
          Försäljning
        </h2>
        <div className="pb-10 pt-8">
          <div className="p-2 flex justify-between">
            <FilterButton time="1 vecka" />
            <FilterButton time="1 månad" />
            <FilterButton time="3 månader" />
            <FilterButton time="1 år" />
          </div>
          <div className={styles.mediaScroller}>
            <SalesCard type="Totalt" tickets="1337 st" cash="200,5k" />
            <SalesCard type="Hooja" tickets="584 st" cash="116,2k" />
            <SalesCard type="Dani M" tickets="370 st" cash="55,5k" />
            <SalesCard type="Halloween" tickets="23 st" cash="1,1k" />
            <SalesCard type="Myra Granberg" tickets="413 st" cash="74,3k" />
          </div>
        </div>
      </div>
      <div className=" bg-orange-100 pb-10 p-2">
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
