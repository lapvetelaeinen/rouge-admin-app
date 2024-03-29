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
      "https://pb0u12mmmh.execute-api.eu-north-1.amazonaws.com/rouge/admin",
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
  }

  if (body.type === "getAllSales") {
    console.log("Call amazon");
    console.log(event);
    const res = await fetch(
      "https://pb0u12mmmh.execute-api.eu-north-1.amazonaws.com/rouge/admin",
      {
        method: "POST",
        body: JSON.stringify({ type: "getAllSales" }),
      }
    );

    const msg = await res.json();
    console.log("message from lambda: ", msg);

    message = msg;
  }

  if (body.type === "editEvent") {
    console.log("Call amazon");
    console.log(event);
    const res = await fetch(
      "https://pb0u12mmmh.execute-api.eu-north-1.amazonaws.com/rouge/admin",
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
  }

  if (body.type === "deleteEvent") {
    console.log("Call amazon");
    console.log(event);
    const res = await fetch(
      "https://pb0u12mmmh.execute-api.eu-north-1.amazonaws.com/rouge/admin",
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
  }

  if (body.type === "createTicket") {
    console.log("Call amazon");
    console.log(event);
    const res = await fetch(
      "https://pb0u12mmmh.execute-api.eu-north-1.amazonaws.com/rouge/admin",
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
  }

  if (body.type === "updateTicket") {
    console.log("Call amazon");
    console.log(event);
    const res = await fetch(
      "https://pb0u12mmmh.execute-api.eu-north-1.amazonaws.com/rouge/admin",
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
  }

  res.status(200).json(message);
};
