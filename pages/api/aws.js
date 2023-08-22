import fetch from "node-fetch";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  const body = JSON.parse(req.body);
  const event = body.event;

  let message;

  if (body.type === "createEvent") {
    console.log("Call amazon");
    console.log(event);
    const res = await fetch(
      "https://h6yb5bsx6a.execute-api.eu-north-1.amazonaws.com/rouge/admin",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const msg = await res.json();
    console.log("message from lambda: ", msg);

    message = msg;

    const revalidationPayload = ["/", "/events"];

    const validateRes = await fetch(
      `https://rougeumea.se/api/revalidate?secret=Rouge_Umea2021!`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(revalidationPayload),
      }
    );

    const validateMsg = await validateRes.json();

    console.log("VALIDATION: ", validateMsg);
  }

  if (body.type === "editEvent") {
    console.log("Call amazon");
    console.log(event);
    const res = await fetch(
      "https://h6yb5bsx6a.execute-api.eu-north-1.amazonaws.com/rouge/admin",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const msg = await res.json();
    console.log("message from lambda: ", msg);

    message = msg;

    const validateRes1 = await fetch(
      `https://rougeumea.se/api/revalidate?secret=Rouge_Umea2021!&path=/`
    );

    const validateRes2 = await fetch(
      `https://rougeumea.se/api/revalidate?secret=Rouge_Umea2021!&path=/event/${event.eventId}`
    );

    const validateRes3 = await fetch(
      `https://rougeumea.se/api/revalidate?secret=Rouge_Umea2021!&path=/events`
    );

    const validateMsg1 = await validateRes1.json();
    const validateMsg2 = await validateRes2.json();
    const validateMsg3 = await validateRes3.json();

    console.log("VALIDATION1: ", validateMsg1);
    console.log("VALIDATION2: ", validateMsg2);
    console.log("VALIDATION3: ", validateMsg3);
  }

  if (body.type === "deleteEvent") {
    console.log("Call amazon");
    console.log(event);
    const res = await fetch(
      "https://h6yb5bsx6a.execute-api.eu-north-1.amazonaws.com/rouge/admin",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const msg = await res.json();
    console.log("message from lambda: ", msg);

    message = msg;

    const validateRes1 = await fetch(
      `https://rougeumea.se/api/revalidate?secret=Rouge_Umea2021!&path=/`
    );

    const validateRes2 = await fetch(
      `https://rougeumea.se/api/revalidate?secret=Rouge_Umea2021!&path=/event/${event.eventId}`
    );

    const validateRes3 = await fetch(
      `https://rougeumea.se/api/revalidate?secret=Rouge_Umea2021!&path=/events`
    );

    const validateMsg1 = await validateRes1.json();
    const validateMsg2 = await validateRes2.json();
    const validateMsg3 = await validateRes3.json();

    console.log("VALIDATION1: ", validateMsg1);
    console.log("VALIDATION2: ", validateMsg2);
    console.log("VALIDATION3: ", validateMsg3);
  }

  if (body.type === "createTicket") {
    console.log("Call amazon");
    console.log(event);
    const res = await fetch(
      "https://h6yb5bsx6a.execute-api.eu-north-1.amazonaws.com/rouge/admin",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const msg = await res.json();
    console.log("message from lambda: ", msg);

    message = msg;

    const validateRes2 = await fetch(
      `https://rougeumea.se/api/revalidate?secret=Rouge_Umea2021!&path=/event/${event.eventId}`
    );

    const validateMsg1 = await validateRes1.json();
    const validateMsg2 = await validateRes2.json();
    const validateMsg3 = await validateRes3.json();

    console.log("VALIDATION1: ", validateMsg1);
    console.log("VALIDATION2: ", validateMsg2);
    console.log("VALIDATION3: ", validateMsg3);
  }

  res.status(200).json(message);
};
