import { useState } from "react";
import { useRouter } from "next/router.js";
import Link from "next/link.js";
import Bars from "./svg-components/Bars";
import Times from "./svg-components/Times";

function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  return (
    <>
      <div className="bg-violet-300 flex justify-between items-center py-3 px-4">
        {isOpen ? (
          <Times
            fill="black"
            width="35px"
            height="35px"
            onClick={() => setIsOpen(!isOpen)}
          />
        ) : (
          <Bars
            fill="black"
            width="35px"
            height="35px"
            onClick={() => setIsOpen(!isOpen)}
          />
        )}
      </div>
      {isOpen ? (
        <div className="bg-violet-200 h-[100vh]">
          <ul className="flex flex-col font-appareo text-2xl text-neutral-800 pl-4">
            <Link href="/">
              <a href="" onClick={() => setIsOpen(!isOpen)} className="p-2">
                Dashboard
              </a>
            </Link>
            <Link href="/admin/create">
              <a href="" onClick={() => setIsOpen(!isOpen)} className="p-2">
                Skapa event
              </a>
            </Link>
            <Link href="/admin/add-tickets">
              <a href="" onClick={() => setIsOpen(!isOpen)} className="p-2">
                Släpp biljetter
              </a>
            </Link>
            <Link href="/">
              <a href="" onClick={() => setIsOpen(!isOpen)} className="p-2">
                Statistik
              </a>
            </Link>
          </ul>
        </div>
      ) : null}
    </>
  );
}

export default Nav;
