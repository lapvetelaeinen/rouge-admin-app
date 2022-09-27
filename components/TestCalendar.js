import { useRouter } from "next/router.js";
import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import dayOfYear from "dayjs/plugin/dayOfYear";
import isoWeek from "dayjs/plugin/isoWeek";
import weekOfYear from "dayjs/plugin/weekOfYear";

dayjs.extend(dayOfYear);
dayjs.extend(isoWeek);
dayjs.extend(weekOfYear);

function TestCalendar({ allEvents }) {
  const router = useRouter();
  const [week, setWeek] = useState(dayjs().isoWeek());
  const [formatted, setFormatted] = useState(null);
  const [events, setEvents] = useState(null);

  const daysOfTheWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const arrayOfObjects = [];

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const today = dayjs().dayOfYear();

  const testDate = dayjs().dayOfYear(197);

  function selectWeek() {
    const rawWeek = dayjs().isoWeek(week);

    const year = rawWeek.$y;
    const day = rawWeek.$D;
    const month = rawWeek.$M + 1;
    let stringMonth = month.toString();

    if (stringMonth.length < 2) {
      stringMonth = "0" + stringMonth;
    }

    const formatWeek =
      year.toString() + "/" + stringMonth + "/" + day.toString();

    console.log(formatWeek);

    let date = new Date(formatWeek);
    // if (formatted) {
    //   date = formatted;
    // }
    const allDays = Array(7)
      .fill(new Date(date))
      .map(
        (el, idx) =>
          new Date(el.setDate(el.getDate() - el.getDay() + (idx + 1)))
      );
    console.log(allDays);



    return allDays.map((day) => (
      <>
        <tr className="border-b-2 border-neutral-400">
          <td className="bg-slate-300 py-2 px-4 w-1 text-center">
            <p suppressHydrationWarning={true}>{day.getDate()}</p>
            <p suppressHydrationWarning={true} className="text-xs">
              {day.getMonth() == 0 && "jan"}
              {day.getMonth() == 1 && "feb"}
              {day.getMonth() == 2 && "mar"}
              {day.getMonth() == 3 && "apr"}
              {day.getMonth() == 4 && "maj"}
              {day.getMonth() == 5 && "jun"}
              {day.getMonth() == 6 && "jul"}
              {day.getMonth() == 7 && "aug"}
              {day.getMonth() == 8 && "sep"}
              {day.getMonth() == 9 && "okt"}
              {day.getMonth() == 10 && "nov"}
              {day.getMonth() == 11 && "dec"}
            </p>
            
          </td>
          <td
            suppressHydrationWarning={true}
            className="bg-slate-200 py-2 px-4"
          >
            {day.getDay() == 1 && "måndag"}
            {day.getDay() == 2 && "tisdag"}
            {day.getDay() == 3 && "onsdag"}
            {day.getDay() == 4 && "torsdag"}
            {day.getDay() == 5 && "fredag"}
            {day.getDay() == 6 && "lördag"}
            {day.getDay() == 0 && "söndag"}
          </td>
          <td className="bg-slate-100 py-2 px-4 w-full">Tentafest</td>
        </tr>
      </>
    ));
  }

  //   selectWeek(date);

  console.log(testDate);

  //   const dayMachine = () => {
  //     for (let i = 0; i < daysOfTheWeek.length; i++) {
  //       const day = dayjs().dayOfYear(today).toString();
  //       const dayOfWeek = dayjs().day();

  //       if (day.split(",")[0] == daysOfTheWeek[i]) {
  //         arrayOfObjects.push(day);
  //       } else {
  //         const realDay = dayjs()
  //           .dayOfYear(day + (dayOfWeek + i - 7))
  //           .toString();
  //         arrayOfObjects.push(realDay);
  //       }
  //     }
  //   };

  //   dayMachine();

  //   console.log(arrayOfObjects);
  //   console.log(testDate.toString());
  //   console.log(today);

  const initialWeek = "";

  const initialWeekFunction = (week) => {
    const rawWeek = dayjs().week(week);

    console.log("raw week:", rawWeek);

    // const year = rawWeek.$y;
    // const day = rawWeek.$D;
    // const month = rawWeek.$M + 1;
    // const stringMonth = month.toString();

    // if (stringMonth.length < 2) {
    //   stringMonth = "0" + stringMonth;
    // }

    // const formatWeek =
    //   year.toString() + "/" + stringMonth + "/" + day.toString();

    // console.log(formatWeek);
    // initialWeek = formatWeek;
  };

  // console.log("Initial week:", initialWeek);

  const weekFunction = (week, e) => {
    const rawWeek = dayjs().isoWeek(week);

    const year = rawWeek.$y;
    const day = rawWeek.$D;
    const month = rawWeek.$M + 1;
    const stringMonth = month.toString();

    if (stringMonth.length < 2) {
      stringMonth = "0" + stringMonth;
    }

    const formatWeek =
      year.toString() + "/" + stringMonth + "/" + day.toString();

    console.log("target:", e.target.innerText);

    if (e.target.innerText == "Föregående") {
      setWeek(week - 1);
    } else {
      setWeek(week + 1);
    }

    setFormatted(formatWeek);
    // const date = new Date(formatWeek);
    // selectWeek(date);
  };

  //   weekFunction();

  const currentWeek = dayjs().isoWeek().toString();
  console.log(currentWeek);

  //   const addZero = () => {
  //     if (stringMonth.length < 2) {
  //       stringMonth = "0" + stringMonth;
  //     }
  //   };

  //   addZero();

  //   console.log(year, day, month);

  //   console.log(formatWeek);

  return (
    <div className="">
      <div className="flex flex-col justify-center items-center w-full shadow-md rounded-xl">
        <div className="bg-orange-300 w-full pl-2 relative flex justify-center rounded-t-xl">
          <p
            className="absolute left-2 top-5 text-sm text-neutral-600"
            onClick={(e) => weekFunction(week, e)}
          >
            Föregående
          </p>
          <p className="text-center py-4">Vecka {week}</p>
          <p
            className="absolute right-2 top-5 text-sm text-neutral-600"
            onClick={(e) => weekFunction(week, e)}
          >
            Nästa
          </p>
        </div>

        <table className="table-auto">
          <tbody>{selectWeek()}</tbody>
        </table>
        <button
          className="bg-violet-400 w-full py-4 shadow-md rounded-b-xl"
          onClick={() => weekFunction(week)}
        >
          Se hela schemat
        </button>
      </div>
    </div>
  );
}

export default TestCalendar;
