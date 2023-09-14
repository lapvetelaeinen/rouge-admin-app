import { useEffect } from "react";
import { useRouter } from "next/router";
import RougeButton from "../RougeButton";

export default function DeleteEventModal({
  toggleAskToDelete,
  isAskToDeleteActive,
  eventId,
}) {
  const router = useRouter();

  useEffect(() => {
    const deleteModal = document.getElementById("deleteModal");

    var handleEvent = function (e) {
      e.preventDefault(); // disables scrolling by mouse wheel and touch move
    };

    deleteModal.addEventListener("scroll", handleEvent, false);
    deleteModal.addEventListener("mousewheel", handleEvent, false);
    deleteModal.addEventListener("touchmove", handleEvent, false);
  }, []);

  const deleteEvent = async () => {
    console.log("deleting event...");
    const payload = {
      type: "deleteEvent",
      event: {
        pk: "event",
        eventId: eventId,
      },
    };

    const lambdaResponse = await fetch("/api/aws", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    router.push("/admin/create-event");
  };

  useEffect(() => {
    if (isAskToDeleteActive) {
      //check for clicks outside element
      const targetDiv = document.getElementById("deleteBox");
      const button1 = document.getElementById("button1");
      const button2 = document.getElementById("button2");

      // Function to handle clicks outside the target div
      function handleClickOutside(event) {
        if (!targetDiv.contains(event.target)) {
          // Clicked outside the target div
          toggleAskToDelete();
          // Do something, like close a modal or perform an action
        }
      }

      const deleteModal = document.getElementById("deleteModal");

      // Add a click event listener to the document
      deleteModal.addEventListener("click", handleClickOutside);

      // You might also need to handle cases where you want to prevent the click event from propagating
      // inside the target div, so it doesn't immediately trigger the click outside handler
      button1.addEventListener("click", function (event) {
        toggleAskToDelete();
        event.stopPropagation();
      });

      button2.addEventListener("click", function (event) {
        deleteEvent();
        event.stopPropagation();
      });
    }
  }, [isAskToDeleteActive]);

  return (
    <div id="deleteModal">
      {isAskToDeleteActive ? (
        <div className="flex justify-center items-center fixed z-50 w-full h-full bg-neutral-800 backdrop-blur-sm left-0 top-0 bg-opacity-50">
          <div
            id="deleteBox"
            className="bg-neutral-200 w-full mx-4 py-12 px-4 text-center rounded-xl"
          >
            <p className="text-xl">
              Är du säker på att du vill radera detta event?
            </p>
            <div className="flex gap-2 justify-center mt-8">
              <button
                id="button1"
                className="
                  bg-transparent border-2 border-neutral-800 text-neutral-800
                py-4 px-12 text-xl  rounded-full"
                onClick={toggleAskToDelete}
              >
                Avbryt
              </button>
              <button
                id="button2"
                className="bg-purple-500
                  text-white
                py-4 px-12 text-xl  rounded-full"
                onClick={deleteEvent}
              >
                Radera
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
