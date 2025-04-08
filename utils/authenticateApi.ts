import axios from "axios";
import {
  CookieValueTypes,
  deleteCookie,
  getCookie,
  setCookie,
} from "cookies-next";
import { env } from "next-runtime-env";
const NEXT_PUBLIC_BASE_URL_APP = env("NEXT_PUBLIC_BASE_URL_APP");
axios.defaults.baseURL = NEXT_PUBLIC_BASE_URL_APP;

let isRefreshing = false;

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    if (error.response.status === 403) {
      window.location.href = "/";
      deleteCookie("Hami_Admin_Token");
      deleteCookie("Hami_Admin_Refresh_Token");
      localStorage.removeItem("privateKey");
    }
    if (error.response.status === 401) {
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        const accessToken = getCookie("Hami_Admin_Token");
        const refreshToken = getCookie("Hami_Admin_Refresh_Token");
        //accessToken && refreshToken && !isRefreshing
        if (!isRefreshing) {
          isRefreshing = true;

          try {
            // Perform token refresh
            const data = await RefreshToken({
              token: accessToken,
              refreshToken: refreshToken,
            });

            // Retry the original request
            return axios(originalRequest);
          } catch (refreshError) {
            console.error("Token refresh failed", refreshError);
            // Handle refresh error, e.g., redirect to login page
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        }
      }
    }

    // For other errors or if refresh token logic is not applicable
    return Promise.reject(error);
  }
);

export async function loginStaff(payload: {
  username: string;
  password: string;
  captcha: {
    key: string;
    value: string;
  };
}) {
  const data = await axios.post("api/Authenticate/LoginStaff", payload);
  return data.data;
}

export async function verifyStaff(payload: {
  otpToken: string | null;
  verificationCode: string;
}) {
  const data = await axios.post("api/Authenticate/VerifyStaff", payload);
  return data.data;
}

// export async function logisterCitizen(payload: {
//   phoneNumber: string;
//   recaptchaToken: string; // ارسال توکن reCAPTCHA
// }) {
//   const data = await axios.post("api/Authenticate/LogisterCitizen", payload);
//   return data.data;
// }

export async function logisterCitizen(payload: {
  phoneNumber: string;
  captcha: {
    key: string;
    value: string;
  };
}) {
  const data = await axios.post("api/Authenticate/LogisterCitizen", payload);
  return data.data;
}

export async function verifyCitizen(payload: {
  phoneNumber: string;
  verificationCode: string;
}) {
  const data = await axios.post("api/Authenticate/VerifyCitizen", payload);
  return data.data;
}

export async function forgetPassword(payload: {
  phoneNumber: string;
  captcha: {
    key: string;
    value: string;
  };
}) {
  const data = await axios.post("api/Authenticate/ForgotPassword", payload);
  return data.data;
}

// ارسال کد تایید برای شماره موبایل
export const verifyResetPasswordCode = async (payload: {
  otpToken: string | null;
  verificationCode: string;
}) => {
  const res = await fetch("/api/verify-reset-code", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw await res.json();
  return await res.json(); // برمی‌گردونه: { token: "...", phoneNumber: "09..." }
};

// ثبت رمز عبور جدید
export const submitNewPassword = async (payload: {
  otpToken: string | null;
  verificationCode: string;
  newPassword: string;
}) => {
  const data = await axios.post("api/Authenticate/ResetPassword", payload);
  return data.data;
};


export async function postChangePhoneNumber(payload: {
  newPhoneNumber: string;
  captcha: {
    key: string;
    value: string;
  };
}) {
  const data = await axios.post("api/Authenticate/PhoneNumber", payload);
  return data.data;
}

export async function putChangePhoneNumber(payload: {
  token1: string;
  code1: string | null;
  token2: string;
  code2: string | null;
}) {
  const data = await axios.put("api/Authenticate/PhoneNumber", payload);
  return data.data;
}

export async function changePassword(payload: {
  token: string;
  newPassword: string;
}) {
  const data = await axios.put("api/Authenticate/ChangePassword", payload);
  return data.data;
}

export async function getProfile(mode?: string) {
  const params = mode ? `?mode=${mode}` : "";
  const data = await axios.get(`api/Authenticate/Profile${params}`);
  return data.data;
}

export async function editProfile(payload: {
  firstName: string;
  lastName: string;
  nationalId?: string;
  phoneNumber2?: string;
  title?: string;
}) {
  const data = await axios.put("api/Authenticate/Profile", payload);
  return data.data;
}

export async function preRegisterPatient(payload: {
  phoneNumber: string;
  username: string; // شماره همراه به عنوان نام کاربری
  password: string;
  nationalId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date; // فرمت YYYY-MM-DD
  gender: number; // 1 = Male, 2 = Female, 3 = Other
  education: number; // 0 = None, 1 = HighSchool, ...
  city: string;
  organ: number; // 1 = Ovary, 2 = Breast, 3 = Prostate
  diseaseType: number; // "Benign" یا "Malignant"
  patientStatus: number; // 1 = NewlyDiagnosed, 2 = UnderTreatment, ...
  stage?: number; // سطح بیماری (اختیاری)
  pathologyDiagnosis?: string; // تشخیص پاتولوژی (اختیاری)
  initialWeight?: number; // وزن اولیه (اختیاری)
  sleepDuration?: number; // مدت خوابیدن (اختیاری)
  appetiteLevel: number; // 1 = High, 2 = Normal, 3 = Low
  gadScore: number; // امتیاز GAD
  mddScore: number; // امتیاز MDD
  roleType:number; //1=Patient, 2= Caregiver
isSmoker:boolean;
}) {
  const data = await axios.post("/api/Authenticate/RegisterPatient", payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return data.data;
}


export async function revoke(payload: {
  refreshToken: string | CookieValueTypes;
}) {
  const token = getCookie("Hami_Admin_Token");
  const data = await axios.post("api/Authenticate/Revoke", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.data;
}

export async function RefreshToken(payload: { token: any; refreshToken: any }) {
  try {
    const response = await axios.post("api/Authenticate/Refresh", payload);
    setCookie("Hami_Admin_Token", response.data.jwtToken);
    setCookie("Hami_Admin_Refresh_Token", response.data.refreshToken);
    return response.data;
  } catch (error) {
    deleteCookie("Hami_Admin_Token");
    deleteCookie("Hami_Admin_Refresh_Token");
    localStorage.removeItem("privateKey");
    window.location.href = "/";
  }
}
