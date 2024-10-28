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

export async function GenerateKeyPair() {
  const data = await axios.get("api/Admin/GenerateKeyPair");
  return data.data;
}

export async function GetKeys() {
  const data = await axios.get("api/Admin/GetKeys");
  return data.data;
}

export async function AddKey(payload: { title: string; publicKey: string }) {
  const data = await axios.post("api/Admin/AddKey", payload);
  return data.data;
}

export async function ChangeKey(payload: {
  privateKey: string;
  publicKeyId: string;
  isPolling: boolean;
}) {
  const data = await axios.post("api/Admin/ChangeKey", payload);
  return data.data;
}

// .....Categories................................................
export async function GetAllCategories() {
  const data = await axios.get("api/ComplaintCategories");
  return data.data;
}

export async function GetSingleCategory({ id }: { id: string }) {
  const data = await axios.get(`api/ComplaintCategories/${id}`);
  return data.data;
}

export async function SubmitCategory(payload: {
  title: string;
  description: string;
}) {
  const data = await axios.post("api/ComplaintCategories", payload);
  return data.data;
}

export async function UpdateCategory({
  id,
  payload,
}: {
  id: string;
  payload: {
    title: string;
    description: string;
  };
}) {
  const data = await axios.put(`api/ComplaintCategories/${id}`, payload);
  return data.data;
}

export async function DeleteCategory({
  id,
  payload,
}: {
  id: string;
  payload: any;
}) {
  const data = await axios.delete(`api/ComplaintCategories/${id}`, {
    data: payload,
    headers: { "Content-Type": "application/json" },
  });

  return data.data;
}

// .....Organizations.............................................
export async function GetAllOrganizations() {
  const data = await axios.get("api/ComplaintOrganizations");
  return data.data;
}

export async function GetSingleOrganization({ id }: { id: string }) {
  const data = await axios.get(`api/ComplaintOrganizations/${id}`);
  return data.data;
}

export async function SubmitOrganization(payload: {
  title: string;
  description: string;
}) {
  const data = await axios.post("api/ComplaintOrganizations", payload);
  return data.data;
}

export async function UpdateOrganization({
  id,
  payload,
}: {
  id: string;
  payload: {
    title: string;
    description: string;
  };
}) {
  const data = await axios.put(`api/ComplaintOrganizations/${id}`, payload);
  return data.data;
}

export async function DeleteOrganization({
  id,
  payload,
}: {
  id: string;
  payload: any;
}) {
  const data = await axios.delete(`api/ComplaintOrganizations/${id}`, {
    data: payload,
    headers: { "Content-Type": "application/json" },
  });

  return data.data;
}

// .....WebContents.............................................
export async function GetWebContents() {
  const data = await axios.get("api/WebContents");
  return data.data;
}

export async function GetSingleWebContents({ id }: { id: string }) {
  const data = await axios.get(`api/WebContents/${id}`);
  return data.data;
}

export async function SubmitWebContents(payload: FormData) {
  const data = await axios.post(`api/WebContents`, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
}

export async function UpdateWebContents({
  id,
  payload,
}: {
  id: string;
  payload: FormData;
}) {
  const data = await axios.put(`api/WebContents/${id}`, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
}

// .....News.................................................
export async function GetAllNews({
  PageNumber = 1,
  PageSize = 4,
}: {
  PageNumber?: number;
  PageSize?: number;
}) {
  const data = await axios.get("api/News", {
    params: { PageNumber: PageNumber, PageSize: PageSize },
  });
  return data;
}

export async function GetSingleNews(id: string) {
  const data = await axios.get(`api/News/${id}`);
  return data.data;
}

export async function SubmitNews(payload: FormData) {
  const data = await axios.post("api/News", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
}

export async function UpdateNews({
  id,
  payload,
}: {
  id: string;
  payload: FormData;
}) {
  const data = await axios.put(`api/News/${id}`, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
}

export async function DeleteNews({ id }: { id: string }) {
  const data = await axios.delete(`api/News/${id}`);
  return data.data;
}

// .....Slider.................................................
export async function GetAllSliders() {
  const data = await axios.get("api/Sliders");
  return data.data;
}

export async function GetSingleSlider({ id }: { id: string }) {
  const data = await axios.get(`api/Sliders/${id}`);
  return data.data;
}

export async function SubmitSlider(payload: FormData) {
  const data = await axios.post("api/Sliders", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
}

export async function UpdateSlider({
  id,
  payload,
}: {
  id: string;
  payload: FormData;
}) {
  const data = await axios.put(`api/Sliders/${id}`, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
}

export async function DeleteSlider({ id }: { id: string }) {
  const data = await axios.delete(`api/Sliders/${id}`);
  return data.data;
}
