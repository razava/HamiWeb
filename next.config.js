/** @type {import('next').NextConfig} */ 
const nextConfig = {
  output: "standalone",
  images: {
    domains: ["sootzaniapi.shetabdahi.ir", "oyoonapi.yazd.ir", "localhost"], 
  },
};

module.exports = nextConfig;
