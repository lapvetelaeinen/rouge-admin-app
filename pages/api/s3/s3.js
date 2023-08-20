import aws from "aws-sdk";
import dotenv from "dotenv";
import crypto from "crypto";
import { promisify } from "util";
const randomBytes = promisify(crypto.randomBytes);

dotenv.config();

const region = process.env.REGION;
const bucketName = process.env.BUCKET_NAME;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY_ID;

const bucketUrl = "https://rouge-images.s3.eu-north-1.amazonaws.com/";

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: "v4",
});

export async function generateUploadURL({ type }) {
  const rawBytes = await randomBytes(16);
  const imageName = rawBytes.toString("hex");
  const imageExtension = "." + type.split("/")[1];

  const params = {
    Bucket: bucketName,
    Key: imageName + imageExtension,
    Expires: 60,
    ContentType: type,
  };

  const uploadURL = await s3.getSignedUrlPromise("putObject", params);
  return uploadURL;
}
