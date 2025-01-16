import axios from "axios";
import { CookieValueTypes, getCookie } from "cookies-next";
import { env } from "next-runtime-env";
const NEXT_PUBLIC_BASE_URL_APP = env("NEXT_PUBLIC_BASE_URL_APP");
axios.defaults.baseURL = NEXT_PUBLIC_BASE_URL_APP;

axios.interceptors.request.use(function (config) {
  const token = getCookie("Hami_Admin_Token");
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});

export async function getInfoList() {
  const data = await axios.get("api/Info/List");
  return data.data;
}

export async function getInfo(id: string = "0") {
  const data = await axios.get(`api/Info/${id}`);
  return data.data;
}

export async function getInfoByUserId(code: string, userId: string = "") {
  const data = await axios.post(`api/Info/${code}`, userId, {
    headers: {
      "Content-Type": "application/json", // ارسال Body به‌صورت JSON
    },
  });
  return data.data;
}


