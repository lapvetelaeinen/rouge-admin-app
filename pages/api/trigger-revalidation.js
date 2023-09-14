import fetch from "node-fetch";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  const path = req.query.path;

  console.log("THIS IS THE PATH: ", path);

  const revalidationRes = await fetch(
    `https://rougeumea.se/api/revalidate?secret=Rouge_Umea2021!&path=${path}`
  );
  const revalMessage = await revalidationRes.json();

  console.log("Server response: ", revalMessage);

  res.status(200).json(revalMessage);
};
