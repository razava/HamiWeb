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
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";

// Update the FormSchema to include terms acceptance
const FormSchema = z.object({
  phoneNumber: z.string().min(1, {
    message: "لطفا شماره همراه را وارد نمایید.",
  }),
  captcha: z
    .string({ required_error: "لطفا کد امنیتی را وارد نمایید." })
    .length(5, { message: "لطفا کد امنیتی را به طور کامل وارد نمایید." }),
  terms: z.literal(true, {
    errorMap: () => ({ message: "شما باید قوانین و مقررات را بپذیرید" }),
  }),
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
      localStorage.setItem("RegisterPhone", form.getValues("phoneNumber"));
      localStorage.removeItem("currentStep");
      localStorage.setItem("currentStep", "0");
      router.push("/RegisterForm");
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
    <div className="grid w-screen h-screen bg-center bg-cover bg-no-repeat bg-[url('/img/login-pattern.png')] place-content-center">
      <div className="w-full sm:[20rem] md:[20rem] xl:w-[30rem] bg-white rounded-lg dark:border xl:p-0 dark:bg-gray-800 dark:border-gray-700 shadow-[0px_0px_15px_0px_#00000040] h-fit">
        <div className="flex flex-col justify-center h-full p-10 space-y-3 md:space-y-4 md:py-10 md:px-12 lg:px-16">
          <Image alt="icon" src={LoginIcon} className="self-center w-1/3" />
          <p className="text-lg font-bold leading-tight tracking-tight text-blue dark:text-white">
            احراز هویت
          </p>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col w-full"
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-3 mt-4">
                <FormField
                  control={form.control}
                  name="captcha"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <FormItem className="items-center flex-1 h-10">
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
                  <div className="flex items-center justify-center gap-2 text-center">
                    <Image
                      alt="icon"
                      src={srcForImage as string}
                      className="h-12 rounded-md shadow-md w-36"
                      width={150}
                      height={20}
                      quality={100}
                    />
                    <RefreshCcw
                      className="cursor-pointer"
                      onClick={() => refetch()}
                      color="#003778"
                    />
                  </div>
                )}
              </div>

              {/* Terms and Conditions Checkbox */}
              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-6">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        <span className="text-sm text-gray-600 mr-2">
                          <Link 
                            href="https://hamihealth.com/privacy-policy/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue hover:underline"
                          >
                            قوانین و مقررات  
                          </Link>{" "}
                          سایت حامی را مطالعه کرده و می‌پذیرم
                        </span>
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <FormMessage className="mt-1" />

              <div className="flex justify-end w-full gap-2 mt-8">
                <Button
                  disabled={loginMutation.isPending || !form.watch("terms")}
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
                    </div>
                  ) : (
                    "تایید"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
