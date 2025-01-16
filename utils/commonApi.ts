import axios from "axios";
import { CookieValueTypes } from "cookies-next";

// Get Category
export async function getCategory() {
  const data = await axios.get("api/Common/Categories");
  return data.data;
}

// Get Captcha
export async function getCaptcha() {
  const data = await axios.get("api/Common/Captcha", { responseType: "blob" });
  return data;
}

// Get Captcha
export async function getContents() {
  const data = await axios.get("api/Common/Contents");
  return data.data;
}

export async function getOptions() {
  const data = await axios.get("/api/Common/Options");
  return data.data;
}

export async function submitDailyMood(mood: number) {
  return await axios.post("api/TestPeriodResult/mood", { mood }, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

