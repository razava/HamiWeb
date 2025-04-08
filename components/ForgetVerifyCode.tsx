"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import OtpInput from "react-otp-input";
import { Triangle, Oval } from "react-loader-spinner";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import LoginIcon from "../public/img/login-icon.svg";
import { Button } from "./ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

// API های فرضی شما
import {
  submitNewPassword,
  verifyResetPasswordCode,
} from "@/utils/authenticateApi";

// 🧩 Zod schema برای تایید کد و رمز عبور
const passwordSchema = z
  .object({
    //otp: z.string().min(6, { message: "کد تایید باید ۶ رقم باشد." }),
    newPassword: z
      .string()
      .min(6, { message: "رمز عبور باید حداقل ۶ کاراکتر باشد." })
      .regex(/[a-z]/, { message: "حداقل یک حرف کوچک نیاز است." })
      .regex(/[A-Z]/, { message: "حداقل یک حرف بزرگ نیاز است." })
      .regex(/[0-9]/, { message: "حداقل یک عدد نیاز است." }),
    confirmPassword: z
      .string()
      .min(6, { message: "تکرار رمز عبور الزامی است." }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "رمز عبور جدید و تکرار آن باید یکسان باشند.",
    path: ["confirmPassword"], // اشاره به فیلدی که خطا می‌دهد
  });

export default function VerifyAndResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const router = useRouter();
  const space = "\xa0";

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
  });

  const handleSubmitNewPassword = async (
    data: z.infer<typeof passwordSchema>
  ) => {
    if (otp.length === 6) {
      setIsLoading(true);
      debugger;
      const payload = {
        otpToken: localStorage.getItem("verificationToken"),
        verificationCode: otp,
        newPassword: data.newPassword,
      };

      try {
        // ارسال کد تایید و پسورد جدید
        //await verifyResetPasswordCode(payload); // تایید کد تایید
        await submitNewPassword(payload); // ارسال رمز عبور جدید
        toast.success("رمز عبور با موفقیت تغییر کرد.");
        router.push("/");
      } catch (err: any) {
        toast.error(err?.response?.data?.detail || "خطا در تغییر رمز عبور.");
      } finally {
        setIsLoading(false);
      }
    } else toast.error("لطفا کد امنتیتی را تکمیل نمایید");
  };

  return (
    <div className="grid w-screen h-screen bg-center bg-cover bg-no-repeat bg-[url('/img/login-pattern.png')] place-content-center">
      <div className="w-full sm:w-[20rem] md:w-[20rem] xl:w-[30rem] bg-white rounded-lg shadow-lg h-fit relative">
        {isLoading && (
          <div className="absolute top-3 left-5">
            <Triangle height="30" width="30" color="#003778" />
          </div>
        )}

        <div className="flex flex-col justify-center p-10 space-y-4 md:px-12 lg:px-16">
          <Image alt="icon" src={LoginIcon} className="self-center w-1/3" />
          <p className="text-lg font-bold text-center text-blue">
            تایید کد و تنظیم رمز عبور جدید
          </p>

          <>
            <div className="w-full" dir="ltr">
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                renderSeparator={<span>{space}</span>}
                renderInput={(props, idx) => (
                  <input autoFocus={idx == 0} pattern="[0-9]*" {...props} />
                )}
                containerStyle=" flex justify-center"
                inputStyle={` !w-10 rounded-md h-10 bg-[#F5F5F5] border border-blue/30 text-black`}
                // ${passwordForm.isSuccess && "border-green-600 transition-all"}
              />
            </div>
            <label className="text-center">
              <span className="text-xs text-blue/70">
                لطفاً کد تایید ارسال‌شده را وارد نمایید.
              </span>
            </label>
          </>

          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit(handleSubmitNewPassword)}
              className="flex flex-col gap-4"
            >
              {/* <FormField
                control={passwordForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>کد تایید</FormLabel>
                    <FormControl>
                      <OtpInput
                        value={otp}
                        onChange={(val) => setOtp(val)}
                        numInputs={6}
                        renderSeparator={<span>{space}</span>}
                        renderInput={(props, idx) => (
                          <input
                            autoFocus={idx === 0}
                            pattern="[0-9]*"
                            {...props}
                            dir="ltr" 
                          />
                        )}
                        containerStyle="flex justify-center"
                        inputStyle="!w-10 rounded-md h-10 bg-[#F5F5F5] border border-blue/30 text-black"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رمز عبور جدید</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="رمز عبور جدید"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>تکرار رمز عبور</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="تکرار رمز عبور"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue text-white hover:bg-blue/90 rounded-xl"
              >
                {isLoading ? (
                  <Oval height={20} width={20} color="#fff" />
                ) : (
                  "تایید رمز عبور جدید"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
