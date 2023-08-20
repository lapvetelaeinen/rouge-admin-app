import fetch from "node-fetch";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  const body = JSON.parse(req.body);
  const { type, eventId } = body;

  let message;

  if (type === "getEvent") {
    console.log("Call amazon");
    console.log(eventId);
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
  }

  res.status(200).json(message);
};
