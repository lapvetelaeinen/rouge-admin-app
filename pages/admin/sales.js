import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { niceDate } from "../../lib/nice-date";

export default function Sales() {
  const [swishSales, setSwishSales] = useState(null);
  const [stripeSales, setStripeSales] = useState(null);
  const [payMethod, setPayMethod] = useState("SWISH");

  const getAllSales = async () => {
    const res = await fetch("/api/aws", {
      method: "POST",
      body: JSON.stringify({ type: "getAllSales" }),
    });

    const data = await res.json();

    setSwishSales(data.swish);
    setStripeSales(data.stripe);
  };

  useEffect(() => {
    getAllSales();
  }, []);

  return (
    <div className="min-h-screen w-full bg-neutral-100 px-4">
      <div className="pt-14 pb-16">
        <h1 className="text-4xl text-center text-neutral-700 font-bold">
          Försäljning per dag
        </h1>
        <div className="w-full flex justify-center mt-12">
          <div className="bg-neutral-300 relative flex text-xl gap-2 rounded-full p-1 shadow-xl">
            <button
              onClick={() => setPayMethod("SWISH")}
              className={`${
                payMethod === "SWISH"
                  ? "bg-gradient-to-l from-neutral-200 to-neutral-100 shadow-inner drop-shadow-md"
                  : ""
              } py-4 px-12 rounded-full`}
            >
              Swish
            </button>
            <button
              onClick={() => setPayMethod("STRIPE")}
              className={`${
                payMethod === "STRIPE"
                  ? "bg-gradient-to-l from-neutral-200 to-neutral-100 shadow-inner drop-shadow-md"
                  : ""
              } py-4 px-12 rounded-full`}
            >
              Kort
            </button>
          </div>
        </div>
      </div>
      {payMethod === "SWISH" ? (
        <div className="mb-16">
          {swishSales ? (
            swishSales.map((item, index) => (
              <div
                className={`bg-gradient-to-tl ${
                  item.ticketClass === "Rouge som kårhus"
                    ? "from-blue-300 to-blue-100"
                    : item.ticketClass === "Sponsrad"
                    ? "from-green-300 to-green-100"
                    : "from-purple-300 to-purple-100"
                } shadow-inner mt-6 p-4 rounded-xl`}
                key={index}
              >
                <p className="mb-2 italic">{niceDate(item.yearMonthDay)}</p>
                <div className="bg-neutral-400 h-[1px] w-full"></div>
                <p className="text-neutral-800 text-xl mt-2">Biljettklass</p>
                <p className="text-lg text-neutral-700">{item.ticketClass}</p>
                <p className="text-neutral-800 text-xl">Försäljning</p>
                <p className="text-lg text-neutral-700">{`${item.sold} st (${item.revenue} SEK)`}</p>
              </div>
            ))
          ) : (
            <div>Laddar...</div>
          )}
        </div>
      ) : (
        <div className="mb-16">
          {stripeSales ? (
            stripeSales.map((item, index) => (
              <div
                className={`bg-gradient-to-tl ${
                  item.ticketClass === "Rouge som kårhus"
                    ? "from-blue-300 to-blue-100"
                    : item.ticketClass === "Sponsrad"
                    ? "from-green-300 to-green-100"
                    : "from-purple-300 to-purple-100"
                } shadow-inner mt-6 p-4 rounded-xl`}
                key={index}
              >
                <p className="mb-2 italic">{niceDate(item.yearMonthDay)}</p>
                <div className="bg-neutral-400 h-[1px] w-full"></div>
                <p className="text-neutral-800 text-xl mt-2">Biljettklass</p>
                <p className="text-lg text-neutral-700">{item.ticketClass}</p>
                <p className="text-neutral-800 text-xl">Försäljning</p>
                <p className="text-lg text-neutral-700">{`${item.sold} st (${item.revenue} SEK)`}</p>
              </div>
            ))
          ) : (
            <div>Laddar...</div>
          )}
        </div>
      )}
      <div className=""></div>
    </div>
  );
}
