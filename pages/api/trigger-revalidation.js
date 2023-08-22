import fetch from "node-fetch";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  const body = JSON.parse(req.body);

  console.log("BODY: ", body);

  const message = "Hejj";

  res.status(200).json(message);
};
