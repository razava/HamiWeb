"use client";
import { putChangePhoneNumber } from "@/utils/authenticateApi";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import LoginIcon from "../public/img/login-icon.svg";
import Image from "next/image";
import OTPInput from "react-otp-input";
import { useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";

export default function ChangePhoneNumber() {
  const [otp, setOtp] = useState("");
  const [otp2, setOtp2] = useState("");
  const [phoneNumber, setPhoneNumber] = useState<any>("");
  const [newPhoneNumber, setNewPhoneNumber] = useState<any>("");
  const space = "\xa0";
  const router = useRouter();
  const changePhoneNumberMutation = useMutation({
    mutationKey: ["putChangePhoneNumber"],
    mutationFn: putChangePhoneNumber,
    onSuccess: (res) => {
      deleteCookie("Hami_Admin_Token");
      localStorage.removeItem("privateKey");
      localStorage.removeItem("privatePassword");
      router.push("/");
      toast("شماره موبایل با موفقیت تغییر یافت.", {
        className: "!bg-green-500 !text-white",
      });
    },
    onError: (err: any | string) => {
      toast(<>{err.response.data.detail}</>, {
        className: "!bg-red-500 !text-white",
      });
    },
  });

  useEffect(() => {
    if (otp.length == 6 && otp2.length == 6) {
      const payload = {
        token1: localStorage.getItem("ph_token") as string,
        code1: otp,
        token2: localStorage.getItem("ph_newToken") as string,
        code2: otp2,
      };
      changePhoneNumberMutation.mutate(payload);
    }
  }, [otp,otp2]);

  useEffect(() => {
    const phoneNumber = localStorage.getItem("ph_phoneNumber");
    const newPhoneNumber = localStorage.getItem("ph_newPhoneNumber");
    setPhoneNumber(phoneNumber);
    setNewPhoneNumber(newPhoneNumber);
  }, []);
  return (
    <div className="grid w-screen h-screen bg-gray-200 place-content-center">
      <div
        className="w-full  sm:[20rem] md:[20rem] xl:w-[30rem] bg-white rounded-lg dark:border xl:p-0 dark:bg-gray-800 dark:border-gray-700 shadow-[0px_0px_15px_0px_#00000040]
      h-fit relative"
      >
        <div className="flex flex-col justify-center h-full p-10 space-y-3 md:space-y-4 md:py-10 md:px-12 lg:px-16">
          <Image alt="icon" src={LoginIcon} className="self-center w-1/3 " />
          <p className="text-lg font-bold leading-tight tracking-tight text-blue dark:text-white">
            کد شماره {phoneNumber}
          </p>
          <div className="w-full " dir="ltr">
            <OTPInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderSeparator={<span>{space}</span>}
              renderInput={(props, idx) => (
                <input autoFocus={idx == 0} pattern="[0-9]*" {...props} />
              )}
              containerStyle=" flex justify-center"
              inputStyle={` !w-10 rounded-md h-10 bg-[#F5F5F5] border border-blue/30 text-black `}
            />
          </div>
          <p className="text-lg font-bold leading-tight tracking-tight text-blue dark:text-white">
            کد شماره {newPhoneNumber}
          </p>
          <div className="w-full " dir="ltr">
            <OTPInput
              value={otp2}
              onChange={setOtp2}
              numInputs={6}
              renderSeparator={<span>{space}</span>}
              renderInput={(props, idx) => (
                <input autoFocus={idx == 0} pattern="[0-9]*" {...props} />
              )}
              containerStyle=" flex justify-center"
              inputStyle={` !w-10 rounded-md h-10 bg-[#F5F5F5] border border-blue/30 text-black `}
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
