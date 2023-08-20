import { generateUploadURL } from "./s3.js";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  const body = JSON.parse(req.body);

  const url = await generateUploadURL({ type: body.type });
  res.send({ url });
};
