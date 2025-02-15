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

//Mentors.....................................................
export async function getMentorsList({
  PageNumber = 1,
  PageSize = 10,
  UserName=""
}: {
  UserName?: string;
  PageNumber?: number;
  PageSize?: number;
}) {
  // export async function getComplaintsList() {
  // const data = await axios.get(`api/Inspector/List`);
  const data = await axios.get(`api/Admin/Mentors`, {
    params: {PageNumber, PageSize },
  });
  return data;
}

export async function getSessionReportByUserId(userId: string) {
  const response = await axios.post(`/api/Admin/SessionReport`, userId, {
    headers: {
      "Content-Type": "application/json", // ارسال Body به‌صورت JSON
    },
  });
  return response.data;
}

export async function getTestPeriodsByUserId(userId: string) {
  const response = await axios.post(`/api/Admin/MyTests`, userId, {
    headers: {
      "Content-Type": "application/json", // ارسال Body به‌صورت JSON
    },
  });
  return response.data;
}

//Patients.....................................................
export async function getPatientsList({
  Status = 0,
  PageNumber = 1,
  PageSize = 10,
  UserName=""
}: {
  Status: number;
  UserName?: string;
  PageNumber?: number;
  PageSize?: number;
}) {
  const data = await axios.get(`api/Admin/Patients`, {
    params: {PageNumber, PageSize,Status },
  });
  return data;
}

export async function getUserMedicalInfoById({ userId }: { userId: string }) {
  const data = await axios(`/api/Admin/patients/${userId}/medical-info`);
  return data.data;
}

export async function getPatientGroups() {
  const data = await axios.get("api/PatientGroup");
  return data.data;
}

// تایید کاربر
export async function approveOrRejectPatient(payload: {
  userId: string;
  patientGroupId: string;
  isApproved: boolean;
  rejectionReason?: string;
}) {
  const data = await axios.post("api/Admin/approve-patient", payload);
  return data.data;
}

// .....PatientGroups.................................................
export async function GetAllPatientGroups({
  PageNumber = 1,
  PageSize = 4
}: {
  PageNumber?: number;
  PageSize?: number;
}) {
  const data = await axios.get("api/PatientGroup", {
    params: { PageNumber: PageNumber, PageSize: PageSize },
  });
  return data;
}

export async function getMentorPatientGroups() {
  const data = await axios.get("api/PatientGroup/MentorGroups");
  return data.data;
}


export async function GetSinglePatientGroup(id: string) {
  const data = await axios.get(`api/PatientGroup/${id}`);
  return data.data;
}

export async function SubmitPatientGroup(payload: FormData) {
  const data = await axios.post("api/PatientGroup", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
}

export async function UpdatePatientGroup({
  id,
  payload,
}: {
  id: string;
  payload: FormData;
}) {
  const data = await axios.put(`api/PatientGroup/${id}`, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
}

export async function DeletePatientGroup({ id }: { id: string }) {
  const data = await axios.delete(`api/PatientGroup/${id}`);
  return data.data;
}

// .....PatientGroups.................................................
export async function GetAllTestPeriods({
  PageNumber = 1,
  PageSize = 4
}: {
  PageNumber?: number;
  PageSize?: number;
}) {
  const data = await axios.get("api/TestPeriod", {
    params: { PageNumber: PageNumber, PageSize: PageSize },
  });
  return data;
}

export async function GetSingleTestPeriod(id: string) {
  const data = await axios.get(`api/TestPeriod/${id}`);
  return data.data;
}

export async function SubmitTestPeriod(payload: FormData) {
  const data = await axios.post("api/TestPeriod", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
}

export async function UpdateTestPeriod({
  id,
  payload,
}: {
  id: string;
  payload: FormData;
}) {
  const data = await axios.put(`api/TestPeriod/${id}`, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
}

export async function DeleteTestPeriod({ id }: { id: string }) {
  const data = await axios.delete(`api/TestPeriod/${id}`);
  return data.data;
}

// .....Questionس.................................................
export async function GetAllQuestions({
  PageNumber = 1,
  PageSize = 4
}: {
  PageNumber?: number;
  PageSize?: number;
}) {
  const data = await axios.get("api/Question", {
    params: { PageNumber: PageNumber, PageSize: PageSize },
  });
  return data;
}

// گرفتن سوالات مربوط به یک آزمون
export async function getTestQuestions(testPeriodId: string) {
  const response = await axios.get(`/api/Question/${testPeriodId}/Questions`);
  return response.data;
}

export async function GetSingleQuestion(id: string) {
  const data = await axios.get(`api/Question/${id}`);
  return data.data;
}

export async function SubmitQuestion(payload: FormData) {
  const data = await axios.post("api/Question", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
}

export async function UpdateQuestion({
  id,
  payload,
}: {
  id: string;
  payload: FormData;
}) {
  const data = await axios.put(`api/Question/${id}`, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
}

export async function DeleteQuestion({ id }: { id: string }) {
  const data = await axios.delete(`api/Question/${id}`);
  return data.data;
}

// .....TestPeriodResults.................................................
export async function GetAllTestPeriodResults({
  PageNumber = 1,
  PageSize = 4
}: {
  PageNumber?: number;
  PageSize?: number;
}) {
  const data = await axios.get("api/TestPeriodResult", {
    params: { PageNumber: PageNumber, PageSize: PageSize },
  });
  return data;
}

export async function GetSingleTestPeriodResult(id: string) {
  const data = await axios.get(`api/TestPeriodResult/${id}`);
  return data.data;
}

export async function SubmitTestPeriodResult(payload: FormData) {
  const data = await axios.post("api/TestPeriodResult", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
}

export async function UpdateTestPeriodResult({
  id,
  payload,
}: {
  id: string;
  payload: FormData;
}) {
  const data = await axios.put(`api/TestPeriodResult/${id}`, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
}

export async function DeleteTestPeriodResult({ id }: { id: string }) {
  const data = await axios.delete(`api/TestPeriodResult/${id}`);
  return data.data;
}


// .....CounselingSessions.................................................
export async function GetAllCounselingSessions({
  PageNumber = 1,
  PageSize = 4
}: {
  PageNumber?: number;
  PageSize?: number;
}) {
  const data = await axios.get("api/CounselingSession", {
    params: { PageNumber: PageNumber, PageSize: PageSize },
  });
  return data;
}

export async function GetSingleCounselingSession(id: string) {
  const data = await axios.get(`api/CounselingSession/${id}`);
  return data.data;
}

export async function SubmitCounselingSession(payload: FormData) {
  const data = await axios.post("api/CounselingSession", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
}

export async function UpdateCounselingSession({
  id,
  payload,
}: {
  id: string;
  payload: FormData;
}) {
  const data = await axios.put(`api/CounselingSession/${id}`, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
}

export async function DeleteCounselingSession({ id }: { id: string }) {
  const data = await axios.delete(`api/CounselingSession/${id}`);
  return data.data;
}

export async function getMentorCounselingSessions(groupId: string | null) {
  const response = await axios.get("/api/CounselingSession/MentorSessions", {
    params: { groupId },
  });
  return response.data;
}

export async function getSessionUsers(sessionId: string | null) {
  const data = await axios.get(`api/CounselingSession/SessionUsers/${sessionId}`);
  return data.data;
}

export const getSessionAttendanceLogs = async (sessionId: string) => {
  const response = await axios.get(`/api/CounselingSession/attendance-logs/${sessionId}`);
  return response.data;
};

export const submitAttendanceLogs = async (payload: {
   sessionId: string;
   attendanceLogs: any[] }) => {
  const data = await axios.post("api/CounselingSession/SubmitAttendanceLogs", payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return data.data;
}

// .....PatientLabTests................................................
// دریافت لیست آزمایش‌های کاربر
export const getPatientLabTests = async () => {
  const response = await axios.get("/api/PatientLabTest");
  return response.data;
};

export async function GetAllPatientLabTests({
  PageNumber = 1,
  PageSize = 4
}: {
  PageNumber?: number;
  PageSize?: number;
}) {
  const data = await axios.get("api/PatientLabTest", {
    params: { PageNumber: PageNumber, PageSize: PageSize },
  });
  return data;
}

// افزودن آزمایش جدید
export const SubmitPatientLabTest = async (data: {
  testType: number;
  testValue: number;
  unit: string;
}) => {
  const response = await axios.post("/api/PatientLabTest", data);
  return response.data;
};

// export async function SubmitPatientLabTest(payload: FormData) {
//   const data = await axios.post("api/PatientLabTest", payload, {
//     headers: { "Content-Type": "application/json" },
//   });
//   return data.data;
// }

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
