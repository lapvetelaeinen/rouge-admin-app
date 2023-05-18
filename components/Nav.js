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
      <div className="bg-gradient-to-br from-pink-500 to-violet-800 flex justify-between items-center py-3 px-4">
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
        <div className="bg-gradient-to-t from-neutral-800 to-pink-400 h-[100vh]">
          <ul className="flex flex-col items-center font-appareo text-4xl text-neutral-800">
            <Link href="/">
              <a href="" onClick={() => setIsOpen(!isOpen)} className="py-6">
                Dashboard
              </a>
            </Link>
            <Link href="/admin/tickets/your-tickets">
              <a href="" onClick={() => setIsOpen(!isOpen)} className="py-6">
                Events
              </a>
            </Link>
            <Link href="/admin/cards">
              <a href="" onClick={() => setIsOpen(!isOpen)} className="py-6">
                Medlemskort
              </a>
            </Link>
          </ul>
        </div>
      ) : null}
    </>
  );
}

export default Nav;
