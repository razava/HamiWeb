"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { GetSingleUser, SubmitUser } from "@/utils/adminApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { addMentor, editMentor } from "@/utils/authenticateApi";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

// تعریف Enums
export enum Gender {
  Male = "1", // مرد
  Female = "2", // زن
  Other = "3", // سایر
}

export enum EducationLevel {
  None = "0", // بدون تحصیلات
  HighSchool = "1", // دیپلم
  Bachelor = "2", // لیسانس
  Master = "3", // فوق لیسانس
  Doctorate = "4", // دکتری
  Other = "5", // سایر
}

// اسکیمای اعتبارسنجی
const mentorSchema = z.object({
  firstName: z.string().min(1, { message: "نام الزامی است" }),
  lastName: z.string().min(1, { message: "نام خانوادگی الزامی است" }),
  phoneNumber: z.string().min(10, { message: "شماره تماس معتبر نیست" }),
  city: z.string().min(1, { message: "شهر الزامی است" }),
  gender: z.union([z.enum(["1", "2", "3"]), z.number()]),
  education: z.union([z.enum(["0", "1", "2", "3", "4", "5"]), z.number()]),
  password: z
    .string()
    .min(6, { message: "رمز عبور باید حداقل 6 کاراکتر باشد." })
    .regex(/[a-z]/, { message: "رمز عبور باید حداقل یک حرف کوچک داشته باشد." })
    .regex(/[A-Z]/, { message: "رمز عبور باید حداقل یک حرف بزرگ داشته باشد." })
    .regex(/[0-9]/, { message: "رمز عبور باید حداقل یک عدد داشته باشد." })
    .optional(),
    title: z.string().min(1, { message: "عنوان الزامی است" }),
    email: z.string().email({ message: "لطفاً یک ایمیل معتبر وارد کنید." }),
});

export default function MentorFormPage({ id }: { id: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: mentor,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["getMentor", id],
    queryFn: () => (id !== "0" ? GetSingleUser(id) : Promise.resolve(null)),
    refetchOnWindowFocus: false,
  });

  const {
    handleSubmit,
    register,
    reset,
    control,
    setValue,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: zodResolver(mentorSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      city: "",
      gender: undefined,
      education: undefined,
      password: "",
      title: "",
    },
  });

  useEffect(() => {
    if (mentor) {
      reset(mentor);
    }
  }, [mentor, reset]);

  const addMentorMutation = useMutation({
    mutationFn: addMentor,
    onSuccess: () => {
      toast.success("منتور با موفقیت اضافه شد!");
      queryClient.invalidateQueries({ queryKey: ["MentorList"] });
      router.push("/UserPanel/AdminDashboard/UserManagement");
    },
    onError: () => {
      toast.error("خطایی در افزودن منتور رخ داد.");
    },
  });

  const editMentorMutation = useMutation({
    mutationFn: editMentor,
    onSuccess: () => {
      toast.success("منتور با موفقیت ویرایش شد!");
      queryClient.invalidateQueries({ queryKey: ["MentorList"] });
      router.push("/UserPanel/AdminDashboard/UserManagement");
    },
    onError: () => {
      toast.error("خطایی در ویرایش منتور رخ داد.");
    },
  });

  const onSubmit = (data: any) => {
    if (id && id !== "0") {
      const updateDto = {
        mentorId: id,
        username: data.phoneNumber,
        phoneNumber: data.phoneNumber,
        firstName: data.firstName,
        lastName: data.lastName,
        title: data.title,
        email: data.email,
        gender: parseInt(data.gender),
        education: data.education ? parseInt(data.education) : 0,
        city: data.city,
      };
      editMentorMutation.mutate(updateDto);
    } else if (id === "0") {
      const addDto = {
        phoneNumber: data.phoneNumber,
        username: data.phoneNumber,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        title: data.title,
        email: data.email,
        gender: parseInt(data.gender),
        education: data.education ? parseInt(data.education) : 0,
        city: data.city,
      };
      addMentorMutation.mutate(addDto);
    } else {
      console.error("مقدار آیدی نامعتبر است!");
    }
  };

  if (isLoading) {
    return <p>در حال بارگذاری...</p>;
  }

  if (error) {
    return <p>خطایی رخ داده است: {error.message}</p>;
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-[#f9f9f9] py-10 px-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-primary-800">
            {id === "0" ? "افزودن منتور" : "ویرایش منتور"}
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">نام:</label>
              <Input {...register("firstName")} placeholder="نام" />
              {errors.firstName && (
                <span className="text-red-500 text-xs">
                  {errors.firstName.message?.toString()}
                </span>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                نام خانوادگی:
              </label>
              <Input {...register("lastName")} placeholder="نام خانوادگی" />
              {errors.lastName && (
                <span className="text-red-500 text-xs">
                  {errors.lastName.message?.toString()}
                </span>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">ایمیل:</label>
              <Input type="email" {...register("email")} placeholder="ایمیل" />
              {errors.email && (
                <span className="text-red-500 text-xs">
                  {errors.email.message?.toString()}
                </span>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                شماره تماس:
              </label>
              <Input {...register("phoneNumber")} placeholder="شماره تماس" />
              {errors.phoneNumber && (
                <span className="text-red-500 text-xs">
                  {errors.phoneNumber.message?.toString()}
                </span>
              )}
            </div>

            {id === "0" && (
              <div>
                <label className="text-sm font-medium text-gray-700">
                  رمز عبور:
                </label>
                <Input
                  type="password"
                  {...register("password")}
                  placeholder="رمز عبور"
                />
                {errors.password && (
                  <span className="text-red-500 text-xs">
                    {errors.password.message?.toString()}
                  </span>
                )}
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-700">
                عنوان:
              </label>
              <Input {...register("title")} placeholder="عنوان" />
              {errors.title && (
                <span className="text-red-500 text-xs">
                  {errors.title.message?.toString()}
                </span>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">جنسیت:</label>
              <select
                {...register("gender")}
                className="w-full border rounded-md p-2"
              >
                <option value={Gender.Male}>مرد</option>
                <option value={Gender.Female}>زن</option>
                <option value={Gender.Other}>سایر</option>
              </select>
              {errors.gender && (
                <span className="text-red-500 text-xs">
                  {errors.gender.message?.toString()}
                </span>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                تحصیلات:
              </label>
              <select
                {...register("education")}
                className="w-full border rounded-md p-2"
              >
                <option value={EducationLevel.None}>بدون تحصیلات</option>
                <option value={EducationLevel.HighSchool}>دیپلم</option>
                <option value={EducationLevel.Bachelor}>لیسانس</option>
                <option value={EducationLevel.Master}>فوق لیسانس</option>
                <option value={EducationLevel.Doctorate}>دکتری</option>
                <option value={EducationLevel.Other}>سایر</option>
              </select>
              {errors.education && (
                <span className="text-red-500 text-xs">
                  {errors.education.message?.toString()}
                </span>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">شهر:</label>
              <Input {...register("city")} placeholder="شهر" />
              {errors.city && (
                <span className="text-red-500 text-xs">
                  {errors.city.message?.toString()}
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="submit"
              className="bg-green-500 text-white hover:bg-green-600 px-6 py-2 rounded-lg shadow-md ml-4"
            >
              {id ? "ذخیره تغییرات" : "افزودن منتور"}
            </Button>
            <Button
              type="button"
              onClick={() =>
                router.push("/UserPanel/AdminDashboard/UserManagement")
              }
              className="bg-gray-500 text-white hover:bg-gray-600 px-6 py-2 rounded-lg shadow-md "
            >
              بازگشت
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
