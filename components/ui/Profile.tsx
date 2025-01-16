"use client";
import React, { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
import Link from "next/link";
import { useMutation, useQuery } from "@tanstack/react-query";
import { editProfile, getProfile } from "@/utils/authenticateApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Oval } from "react-loader-spinner";
import ChangePhoneNumberDialog from "../ChangePhoneNumberDialog";
import ChangePasswordDialog from "../ChangePasswordDialog";

const FormSchema = z.object({
  firstName: z.string().trim().min(1, {
    message: "لطفا نام خود را وارد نمایید.",
  }),
  lastName: z.string().trim().min(1, {
    message: "لطفا نام خانوادگی خود را وارد نمایید.",
  }),
  phoneNumber: z.string().trim().optional(), // اگر شماره تلفن باید بدون اسپیس باشد، از .trim() استفاده می‌کنیم
  patientGroupName: z.string().trim().optional(),
  mentorName: z.string().trim().optional(),
});

export default function Profile() {
  const router = useRouter();
  const userRole = localStorage.getItem("Hami_Role");

  const [open, setOpen] = useState<boolean>(false);
  const [open2, setOpen2] = useState<boolean>(false);
  const {
    data: profileData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["Profile"],
    queryFn: () => getProfile(userRole || ""),
    refetchOnWindowFocus: false,
  });

  const editProfileMutation = useMutation({
    mutationKey: ["editProfile"],
    mutationFn: editProfile,
    onSuccess: (res) => {
      refetch();
      toast("پروفایل شما با موفقیت ویرایش شد.", {
        className: "!bg-green-500 !text-white",
      });
      router.push("/");
    },
    onError: (err: any | string) => {
      toast(<>{err.response.data.detail}</>, {
        className: "!bg-red-500 !text-white",
      });
    },
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  useEffect(() => {
    if (profileData) {
      form.setValue("firstName", profileData.firstName);
      form.setValue("lastName", profileData.lastName);
      form.setValue("phoneNumber", profileData.phoneNumber);
      form.setValue("patientGroupName", profileData.patientGroupName);
      form.setValue("mentorName", profileData.mentorName);
    }
  }, [profileData]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const payload = data;
    editProfileMutation.mutate(payload);
  }

  return (
    <div className=" w-full mx-auto mt-20 h-full pt-12 md:w-2/3 xl:w-1/2 p-8">
      <div className="flex flex-col justify-center h-full space-y-4 md:space-y-4">
        <h2 className=" w-full font-bold">اطلاعات هویتی</h2>
        {profileData && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col w-full mt-6  "
            >
              <div className="flex flex-row flex-wrap justify-between border p-4 rounded-md">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="w-full sm:w-[48%]">
                      <FormLabel className="text-[#7C838A] text-sm font-medium">
                        نام
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="نام خود را وارد نمایید"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="w-full sm:w-[48%] ">
                      <FormLabel className="text-[#7C838A] text-sm font-medium">
                        نام خانوادگی
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="نام خانوادگی خود را وارد نمایید"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end w-full gap-2 mt-8">
                  <Button
                    disabled={editProfileMutation.isPending}
                    type="submit"
                    className="w-32 p-2 text-white transition bg-blue hover:bg-blue/90  rounded-xl max-sm:text-xs"
                  >
                    {editProfileMutation.isPending ? (
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
                      "ذخیره"
                    )}
                    {/* ورود */}
                  </Button>
                </div>{" "}
              </div>

              {userRole === "Patient" && (
                <>
                  <h2 className=" w-full font-bold mt-5 mb-2">
                    اطلاعات گروه درمانی
                  </h2>
                  <div className=" border p-4 flex max-lg:flex-col justify-between rounded-md items-center">
                    <FormField
                      control={form.control}
                      name="patientGroupName"
                      render={({ field }) => (
                        <FormItem className="w-full sm:w-[48%]">
                          <FormLabel className="text-[#7C838A]  text-sm font-medium mt-7">
                            نام گروه
                          </FormLabel>
                          <FormControl>
                            <Input type="text" {...field} readOnly />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="mentorName"
                      render={({ field }) => (
                        <FormItem className="w-full sm:w-[48%]">
                          <FormLabel className="text-[#7C838A]  text-sm font-medium mt-7">
                            منتور گروه
                          </FormLabel>
                          <FormControl>
                            <Input type="text" {...field} readOnly />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}
              <h2 className=" w-full font-bold mt-5 mb-2">اطلاعات ورود</h2>
              <div className=" border p-4 flex max-lg:flex-col justify-between rounded-md items-center">
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem className="w-full sm:w-[48%]">
                      <FormLabel className="text-[#7C838A]  text-sm font-medium mt-7">
                        شماره موبایل
                      </FormLabel>
                      <FormControl>
                        <Input type="text" {...field} readOnly />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2 max-md:justify-center max-md:mt-6 max-md:w-full">
                  {/* <Button
                    type="button"
                    disabled={editProfileMutation.isPending}
                    onClick={() => setOpen(true)}
                    className="max-sm:w-1/2 w-32 p-2 max-sm:text-xs text-white transition bg-blue hover:bg-blue/90  rounded-xl"
                  >
                    تغییر شماره موبایل
                  </Button> */}
                  <Button
                    type="button"
                    disabled={editProfileMutation.isPending}
                    onClick={() => setOpen2(true)}
                    className="max-sm:w-1/2 w-32 p-2 text-white transition bg-blue hover:bg-blue/90  rounded-xl max-sm:text-xs"
                  >
                    تغییر رمز عبور
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        )}
      </div>
      <ChangePhoneNumberDialog open={open} setOpen={setOpen} />
      <ChangePasswordDialog open={open2} setOpen={setOpen2} />
    </div>
  );
}
