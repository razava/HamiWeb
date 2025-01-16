"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import LoginIcon from "../public/img/login-icon.svg";
import OtpInput from "react-otp-input";
import { Button } from "./ui/button";
import { verifyCitizen, verifyStaff } from "@/utils/authenticateApi";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import useData from "@/store/useData";
import { JwtPayload, jwtDecode } from "jwt-decode";
import { setCookie } from "cookies-next";
import { Oval, Triangle } from "react-loader-spinner";
import { toast } from "sonner";

export default function Verify() {
  const [otp, setOtp] = useState("");
  const space = "\xa0";
  const router = useRouter();
  const userData = useData((state) => state.data);
  
  const verifyMutation = useMutation({
    mutationFn: verifyStaff,
    onSuccess: (res) => {
      const decodedToken = jwtDecode<any>(res.jwtToken);
      setCookie("Hami_Admin_Token", res.jwtToken);
      setCookie("Hami_Admin_Refresh_Token", res.refreshToken);
      const userRole =
        decodedToken[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ];
      localStorage.setItem("Hami_Role", userRole);
      if (userRole == "Mentor") {
        router.push("/UserPanel/ControllerDashboard");
      } else if (userRole == "Admin") {
        router.push("/UserPanel/AdminDashboard");
      } else if (userRole == "Patient") {
        //  if(localStorage.getItem("ShowPreRegister") === "yes")
        //   router.push("/RegisterForm");
        //  else
          router.push("/UserPanel/PatientDashboard");
      } 
      
    },
    onError: (err: any | string) => {
      toast(<>{err.response.data.detail}</>, {
        className: "!bg-red-500 !text-white",
      });
    },
  });

  useEffect(() => {
    useData.persist.rehydrate();
  }, []);

  useEffect(() => {
    if (otp.length == 6) {
      const payload = {
        otpToken: localStorage.getItem("verificationToken"),
        verificationCode: otp,
      };
      verifyMutation.mutate(payload);
    }
  }, [otp]);

  return (
    <div className="grid w-screen h-screen bg-center bg-cover bg-no-repeat bg-[url('/img/login-pattern.png')] place-content-center">
      <div
        className="w-full  sm:[20rem] md:[20rem] xl:w-[30rem] bg-white rounded-lg dark:border xl:p-0 dark:bg-gray-800 dark:border-gray-700 shadow-[0px_0px_15px_0px_#00000040]
      h-fit relative"
      >
        {verifyMutation.isPending && (
          <div className="absolute top-3 left-5  bg-transparent">
            <Triangle
              visible={true}
              height="30"
              width="30"
              color="#003778"
              ariaLabel="triangle-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        )}

        <div className="flex flex-col justify-center h-full p-10 space-y-3 md:space-y-4 md:py-10 md:px-12 lg:px-16">
          <Image alt="icon" src={LoginIcon} className="self-center w-1/3 " />
          <p className="text-lg font-bold leading-tight tracking-tight text-blue dark:text-white">
            تایید کد
          </p>
          <div className="w-full " dir="ltr">
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderSeparator={<span>{space}</span>}
              renderInput={(props, idx) => (
                <input autoFocus={idx == 0} pattern="[0-9]*" {...props} />
              )}
              containerStyle=" flex justify-center"
              inputStyle={` !w-10 rounded-md h-10 bg-[#F5F5F5] border border-blue/30 text-black ${
                verifyMutation.isSuccess && "border-green-600 transition-all"
              }`}
            />
          </div>
          <label className="text-center label">
            <span className="text-xs text-center text-blue/70 label-text">
              کد دریافت شده توسط پیامک را وارد نمایید.
            </span>
          </label>
          {/* <div className="flex justify-end w-full gap-2 mt-14">
            <Button
              disabled={verifyMutation.isPending}
              onClick={handelVerify}
              type="submit"
              className="w-1/2 p-2 text-white bg-blue hover:bg-blue/90 md:w-1/3 rounded-xl"
            >
              {verifyMutation.isPending ? (
                <div className="flex items-center justify-center gap-2">
                  <Oval
                    visible={true}
                    height="20"
                    width="20"
                    color="#fff"
                    ariaLabel="oval-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                  />
                </div>
              ) : (
                "تایید"
              )}
            </Button>
          </div> */}
        </div>
      </div>
    </div>
  );
}
