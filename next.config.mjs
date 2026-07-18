/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};
module.exports = {
  extends: ["next/core-web-vitals"],
  rules: {
    "react/no-unescaped-entities": "off",
  },
};

export default nextConfig;
