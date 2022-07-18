import { useRouter } from "next/router.js";
import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import dayOfYear from "dayjs/plugin/dayOfYear";
import isoWeek from "dayjs/plugin/isoWeek";
import weekOfYear from "dayjs/plugin/weekOfYear";

dayjs.extend(dayOfYear);
dayjs.extend(isoWeek);
dayjs.extend(weekOfYear);

function Calendar() {
  const router = useRouter();
  const [week, setWeek] = useState([]);
  const [daysInWeek, setDaysInWeek] = useState([]);
  const daysOfTheWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  //   useEffect(() => {
  //     const date = new Date("2022/07/16");
  //     selectWeek(date);
  //   }, []);

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
    const date = new Date("2022/07/9");
    const allDays = Array(7)
      .fill(new Date(date))
      .map((el, idx) =>
        new Date(
          el.setDate(el.getDate() - el.getDay() + (idx + 1))
        ).toLocaleString("se-SE", options)
      );
    setWeek(allDays);
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

  const weekFunction = () => {
    const rawWeek = dayjs().isoWeek();

    const year = rawWeek.$y;
    const day = rawWeek.$D;
    const month = rawWeek.$M + 1;
    const stringMonth = month.toString();

    if (stringMonth.length < 2) {
      stringMonth = "0" + stringMonth;
    }

    const formatWeek =
      year.toString() + "/" + stringMonth + "/" + day.toString();

    const date = new Date(formatWeek);
    selectWeek(date);
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
    <div className="flex flex-col justify-center items-center w-full bg-violet-300">
      <div className="bg-orange-300 w-full pl-2">
        <p>Vecka {currentWeek}</p>
      </div>

      <table className="table-auto">
        <tbody>
          {week.map((day) => (
            <>
              <tr className="border-b-2 border-neutral-400">
                <td className="bg-slate-300 py-2 px-4 w-1 text-center">
                  <p></p>
                  <p className="text-xs">Juli</p>
                </td>
                <td className="bg-slate-200 py-2 px-4">{day}</td>
                <td className="bg-slate-100 py-2 px-4 w-full">Tentafest</td>
              </tr>
            </>
          ))}
        </tbody>
      </table>
      <button onClick={() => selectWeek()}>click</button>
    </div>
  );
}

export default Calendar;
