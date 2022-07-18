import { useRouter } from "next/router.js";
import React, { useState, useEffect } from "react";
import Image from "next/image";

function CalendarItem({ date }) {
  const router = useRouter();
  return (
    <tr>
      <td className="bg-slate-300 py-2 px-4 w-1 text-center">1</td>
      <td className="bg-slate-200 py-2 px-4">Måndag</td>
      <td className="bg-slate-100 py-2 px-4 w-full">Tentafest</td>
    </tr>
  );
}

export default CalendarItem;
