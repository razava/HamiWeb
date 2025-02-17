"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { FaUserPlus } from 'react-icons/fa';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import Image from "next/image";
import LoginIcon from "../public/img/login-icon.svg";
import { useMutation, useQuery } from "@tanstack/react-query";
import { logisterCitizen } from "@/utils/authenticateApi";
import { getCaptcha } from "@/utils/commonApi";
import { useRouter } from "next/navigation";
import { Oval, ThreeDots } from "react-loader-spinner";
import useData from "@/store/useData";
import { toast } from "sonner";
import { errorMessages } from "@/constants";
import { RefreshCcw } from "lucide-react";
const FormSchema = z.object({
  phoneNumber: z.string().min(1, {
    message: "لطفا شماره همراه را وارد نمایید.",
  }),
  captcha: z
    .string({ required_error: "لطفا کد امنیتی را وارد نمایید." })
    .length(5, { message: "لطفا کد امنیتی را به طور کامل وارد نمایید." }),
});

export default function Register() {
  const router = useRouter();
  const saveData = useData((state) => state.saveData);

  const {
    data: CaptchaData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["Captcha"],
    queryFn: () => getCaptcha(),
    refetchOnWindowFocus: false,
  });

  const loginMutation = useMutation({
    mutationFn: logisterCitizen,
    onSuccess: (res: any | string) => {
      router.push("/RegisterForm");
      //localStorage.setItem("VerifyRole", "Patient");
      //localStorage.setItem("RegisterUser", res);//Implement For Rejected User Needed
      localStorage.setItem("RegisterPhone",form.getValues("phoneNumber") );
      //localStorage.setItem("verificationToken", res);
    },
    onError: (err: any | string) => {
      refetch();
      toast(<>{err.response.data.detail}</>, {
        className: "!bg-red-500 !text-white",
      });
    },
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const payload = {
      phoneNumber: data.phoneNumber,
      captcha: {
        key: CaptchaData?.headers["captcha-key"],
        value: data.captcha,
      },
    };
    loginMutation.mutateAsync(payload);
    saveData({
      phoneNumber: data.phoneNumber,
    });
  }

  const srcForImage = CaptchaData
    ? URL.createObjectURL(CaptchaData.data)
    : null;

  return (
    <div className="grid w-screen h-screen bg-center bg-cover bg-no-repeat  bg-[url('/img/login-pattern.png')]  place-content-center">
      <div
        className="w-full  sm:[20rem] md:[20rem] xl:w-[30rem] bg-white rounded-lg dark:border xl:p-0 dark:bg-gray-800 dark:border-gray-700 shadow-[0px_0px_15px_0px_#00000040]
      h-fit"
      >
        <div className="flex flex-col justify-center h-full p-10 space-y-3 md:space-y-4 md:py-10 md:px-12 lg:px-16">
          <Image alt="icon" src={LoginIcon} className="self-center w-1/3 " />
          {/* <FaUserPlus
            size={50}
            className="self-center w-1/3 "
            style={{
              stroke: '#003778', // رنگ سورمه‌ای برای خطوط
              strokeWidth: 30,    // ضخامت خط
              fill: 'none',      // داخل آیکون خالی باشد
            }}
          /> */}
          <p className="text-lg font-bold leading-tight tracking-tight text-blue dark:text-white">
          احراز هویت
          </p>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col w-full "
            >
              <FormField
                control={form.control}
                name="phoneNumber"
                rules={{ required: true }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#7C838A] text-sm font-medium">
                      شماره همراه
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="mb-4"
                        placeholder="شماره همراه خود را وارد نمایید"
                        {...field}
                      />
                    </FormControl>
                    {/* <FormDescription>
                    This is your public display name.
                  </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <FormField
                control={form.control}
                name="password"
                rules={{ required: true }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#7C838A]  text-sm font-medium mt-7">
                      رمز عبور
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="رمز عبور خود را وارد کنید"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <div className="flex items-center gap-3 mt-4">
                <FormField
                  control={form.control}
                  name="captcha"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <FormItem className="items-center flex-1 h-10 ">
                      {/* <FormLabel className="text-[#7C838A]  text-sm font-medium mt-7">
                    رمز عبور
                  </FormLabel> */}
                      <FormControl>
                        <Input placeholder="کد امنیتی" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {isLoading ? (
                  <div className="flex justify-center text-center w-36">
                    <ThreeDots
                      visible={true}
                      height="50"
                      width="50"
                      color="#003778"
                      radius="9"
                      ariaLabel="three-dots-loading"
                      wrapperStyle={{}}
                      wrapperClass=""
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-center ">
                    <Image
                      alt="icon"
                      src={srcForImage as string}
                      className="h-12 rounded-md shadow-md w-36"
                      width={150}
                      height={20}
                      quality={100}
                    />
                    <RefreshCcw
                      className="cursor-pointer "
                      onClick={() => refetch()}
                      color="#003778"
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-end w-full gap-2 mt-14">
                <Button
                  disabled={loginMutation.isPending}
                  type="submit"
                  className="w-1/2 p-2 text-white transition bg-blue hover:bg-blue/90 md:w-1/3 rounded-xl"
                >
                  {loginMutation.isPending ? (
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
                      {/* <p>در حال انجام ...</p> */}
                    </div>
                  ) : (
                    "تایید"
                  )}
                  {/* ورود */}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}



// "use client";

// import React, { useState } from "react";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import * as z from "zod";
// import { Button } from "@/components/ui/button";
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import Image from "next/image";
// import LoginIcon from "../public/img/login-icon.svg";
// import { useMutation } from "@tanstack/react-query";
// import { logisterCitizen } from "@/utils/authenticateApi";
// import { useRouter } from "next/navigation";
// import { Oval } from "react-loader-spinner";
// import { toast } from "sonner";
// import ReCAPTCHA from "react-google-recaptcha";

// // ✅ تعریف اعتبارسنجی فرم با Zod
// const FormSchema = z.object({
//   phoneNumber: z.string().min(1, { message: "لطفا شماره همراه را وارد نمایید." }),
//   recaptcha: z.string().min(1, { message: "لطفا کپچا را تأیید کنید." }),
// });

// export default function Register() {
//   const router = useRouter();
//   const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

//   const registerMutation = useMutation({
//     mutationFn: logisterCitizen,
//     onSuccess: () => {
//       router.push("/RegisterForm");
//       localStorage.setItem("RegisterPhone", form.getValues("phoneNumber"));
//     },
//     onError: (err: any) => {
//       toast(<>{err.response?.data?.detail || "خطا در ارسال اطلاعات!"}</>, {
//         className: "!bg-red-500 !text-white",
//       });
//     },
//   });

//   const form = useForm<z.infer<typeof FormSchema>>({
//     resolver: zodResolver(FormSchema),
//   });

//   function onSubmit(data: z.infer<typeof FormSchema>) {
//     console.log("Recaptcha Token:", recaptchaToken); // مقدار کپچا را در کنسول بررسی کنید
  
//     if (!recaptchaToken) {
//       toast("لطفا کپچا را تأیید کنید!", { className: "!bg-red-500 !text-white" });
//       return;
//     }
  
//     const payload = {
//       phoneNumber: data.phoneNumber,
//       recaptchaToken,
//     };
  
//     registerMutation.mutate(payload);
//   }
  

//   return (
//     <div className="grid w-screen h-screen bg-center bg-cover bg-no-repeat bg-[url('/img/login-pattern.png')] place-content-center">
//       <div className="w-full sm:w-[20rem] md:w-[20rem] xl:w-[30rem] bg-white rounded-lg shadow-lg p-10">
//         <Image alt="icon" src={LoginIcon} className="self-center w-1/3" />
//         <p className="text-lg font-bold text-center text-blue-700">احراز هویت</p>

//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-4">
//             <FormField
//               control={form.control}
//               name="phoneNumber"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>شماره همراه</FormLabel>
//                   <FormControl>
//                     <Input placeholder="شماره همراه خود را وارد نمایید" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* ✅ Google reCAPTCHA */}
//             <div className="flex justify-center">
//               <ReCAPTCHA
//                 sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
//                 onChange={(token) => setRecaptchaToken(token)}
//               />
//             </div>

//             <Button type="submit" disabled={registerMutation.isPending} className="w-full">
//               {registerMutation.isPending ? <Oval height="20" width="20" color="#fff" /> : "تایید"}
//             </Button>
//           </form>
//         </Form>
//       </div>
//     </div>
//   );
// }
