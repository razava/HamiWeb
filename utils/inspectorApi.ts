// "use client";
// import useToken from "@/store/useToken";
import axios from "axios";
import { CookieValueTypes, getCookie } from "cookies-next";
import { RefreshToken } from "./authenticateApi";
import { env } from "next-runtime-env";
const NEXT_PUBLIC_BASE_URL_APP = env("NEXT_PUBLIC_BASE_URL_APP");
axios.defaults.baseURL = NEXT_PUBLIC_BASE_URL_APP;

axios.interceptors.request.use(function (config) {
  const token = getCookie("Hami_Admin_Token");
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});

export async function getPossibleStates() {
  const data = await axios.get(`api/Inspector/PossibleStates`);
  return data.data;
}

export async function getComplaintsList({
  states = 0,
  TrackingNumber,
  PageNumber = 1,
  PageSize = 10,
}: {
  states: number;
  TrackingNumber?: string;
  PageNumber?: number;
  PageSize?: number;
}) {
  // export async function getComplaintsList() {
  // const data = await axios.get(`api/Inspector/List`);
  const data = await axios.get(`api/Inspector/List?States=${states}`, {
    params: { TrackingNumber: TrackingNumber, PageNumber, PageSize },
  });
  return data;
}

export async function getComplaint(payload: {
  trackingNumber: string;
  password: string;
}) {
  const data = await axios.post(`api/Inspector/Get`, payload);
  return data.data;
}

export async function OperateByInspector(payload: FormData) {
  const data = await axios.post(`api/Inspector/Operate`, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
}

export async function postConnectionId(id: string) {
  const data = await axios.post("/api/Common/ConnectionId", id, {
    headers: { "Content-Type": "application/json" },
  });
  return data.data;
}
