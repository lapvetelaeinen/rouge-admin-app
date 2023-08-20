/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  images: {
    domains: [
      "rouge-event-images.s3.eu-west-2.amazonaws.com",
      "rouge-images.s3.eu-north-1.amazonaws.com",
    ],
  },
};

module.exports = nextConfig;
