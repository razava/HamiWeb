/** @type {import('next').NextConfig} */ 
const nextConfig = {
  output: "standalone",
  images: {
    domains: [
      "localhost",
      "hamihealth.com", // اضافه کردن دامنه جدید
      "hamiapi.shetabdahi.ir", // اضافه کردن دامنه جدید
      "api.hamihealth.com" // دامنه برای API
    ], 
  },
  eslint: {
    ignoreDuringBuilds: true, // نادیده گرفتن خطاها در زمان ساخت
  },
};

module.exports = nextConfig;
