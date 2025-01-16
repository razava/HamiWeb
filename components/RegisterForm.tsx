"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { preRegisterPatient } from "@/utils/authenticateApi"; // فرض می‌کنیم این متد در API شما موجود باشد.
import { useRouter } from "next/navigation";
import { Oval } from "react-loader-spinner";
import { toast } from "sonner";

// تعریف الگوی اعتبارسنجی با Zod برای مرحله 1
const Step1Schema = z.object({
  phoneNumber: z
    .string()
    .min(10, { message: "شماره همراه باید حداقل 10 رقم باشد." })
    .regex(/^09\d{9}$/, { message: "شماره همراه معتبر نیست." }), // اعتبارسنجی شماره همراه ایران
  password: z
    .string()
    .min(6, { message: "رمز عبور باید حداقل 6 کاراکتر باشد." })
    .regex(/[a-z]/, { message: "رمز عبور باید حداقل یک حرف کوچک داشته باشد." }) // حروف کوچک
    .regex(/[A-Z]/, { message: "رمز عبور باید حداقل یک حرف بزرگ داشته باشد." }) // حروف بزرگ
    .regex(/[0-9]/, { message: "رمز عبور باید حداقل یک عدد داشته باشد." }), // اعداد
  firstName: z
    .string()
    //.min(1, { message: "نام الزامی است." })
    .max(50, { message: "نام نمی‌تواند بیشتر از 50 کاراکتر باشد." }),
  lastName: z
    .string()
    //.min(1, { message: "نام خانوادگی الزامی است." })
    .max(50, { message: "نام خانوادگی نمی‌تواند بیشتر از 50 کاراکتر باشد." }),
  nickName: z
    .string()
    .min(1, { message: "نام مستعار الزامی است." })
    .max(50, { message: "نام مستعار نمی‌تواند بیشتر از 50 کاراکتر باشد." }),
  email: z.string().email({ message: "لطفاً یک ایمیل معتبر وارد کنید." }),
  gender: z.enum(["1", "2"], {
    required_error: "انتخاب جنسیت الزامی است.",
  }),
  dateOfBirth: z
  .date({
    required_error: "تاریخ تولد الزامی است.",
    invalid_type_error: "لطفاً یک تاریخ معتبر وارد کنید.",
  })
  .refine((value) => value instanceof Date && !isNaN(value.getTime()), {
    message: "تاریخ تولد نامعتبر است.",
  }),
  education: z.enum(["0", "1", "2", "3", "4", "5"]).optional(), // اختیاری کردن فیلد
  city: z
    .string()
    //.min(1, { message: "لطفاً شهر محل سکونت خود را وارد کنید." })
    .max(100, { message: "نام شهر نمی‌تواند بیشتر از 100 کاراکتر باشد." }),
});

// تعریف الگوی اعتبارسنجی برای مرحله 2
const Step2Schema = z.object({
  diseaseType: z.enum(["1", "2"], {
    required_error: "لطفاً نوع بیماری را انتخاب کنید.",
  }), // نوع بیماری (خوش‌خیم یا بدخیم)
  organ: z.enum(["1", "2", "3"], {
    required_error: "لطفاً ارگان درگیر را انتخاب کنید.",
  }), // ارگان درگیر
  patientStatus: z.enum(["1", "2", "3", "4"], {
    required_error: "لطفاً وضعیت بیماری را انتخاب کنید.",
  }), // وضعیت بیماری
  stage: z
    .enum(["", "1", "2", "3", "4"], {
      required_error: "لطفاً سطح بیماری را انتخاب کنید.",
    })
    .optional(), // سطح بیماری (می‌تواند خالی باشد)
  pathologyDiagnosis: z
    .string()
    .max(200, {
      message: "تشخیص پاتولوژی نمی‌تواند بیشتر از 200 کاراکتر باشد.",
    })
    .optional(), // تشخیص پاتولوژی (اختیاری)
  initialWeight: z
    .number({ invalid_type_error: "وزن اولیه باید یک مقدار عددی باشد." })
    // .positive({ message: "وزن اولیه باید بزرگتر از صفر باشد." })
    // .max(300, { message: "وزن اولیه نمی‌تواند بیشتر از 300 کیلوگرم باشد." })
    .optional(), // وزن اولیه (اختیاری)
  sleepDuration: z
    .number({ invalid_type_error: "مدت خوابیدن باید یک مقدار عددی باشد." })
    .positive({ message: "مدت خوابیدن باید بزرگتر از صفر باشد." })
    .max(24, { message: "مدت خوابیدن نمی‌تواند بیشتر از 24 ساعت باشد." })
    .optional(), // مدت خوابیدن (اختیاری)
  appetiteLevel: z.enum(["1", "2", "3"], {
    required_error: "لطفاً میزان اشتها را انتخاب کنید.",
  }), // میزان اشتها
});

const GADSchema = z.object({
  gadAnswers: z.array(
    z.object({
      questionId: z.string(), // فرض می‌کنیم ID سؤال به صورت رشته‌ای ارسال می‌شود
      answerValue: z.number().min(0).max(3), // مقادیر بین 0 تا 3
    })
  ),
});

const MDDSchema = z.object({
  mddAnswers: z.array(
    z.object({
      questionId: z.string(), // فرض می‌کنیم ID سؤال به صورت رشته‌ای ارسال می‌شود
      answerValue: z.number().min(0).max(3), // مقادیر بین 0 تا 3
    })
  ),
});

const gadQuestions = [
  "داشتن احساس بی‌قراری، خشم، اضطراب، عصبانیت",
  "ناتوانی در توقف یا کنترل نگرانی",
  "نگرانی بیش از حد پیرامون مسائل مختلف",
  "اشکال در آرامش داشتن (عدم توانایی در حفظ آرامش خود)",
  "بی‌قراری شدید به حدی که نمی‌توانم بنشینم",
  "به سهولت عصبی یا بی‌قرار می‌شوم",
  "ترس این رو دارم که هر لحظه اتفاق بدی بیفتد",
];

const mddQuestions = [
  "علاقه یا لذت کم در اجرای کارها (علاقه یا لذت کمی برای انجام دادن کارها دارم)",
  "احساس افسردگی، مود پایین یا ناامیدی دارم",
  "اختلال خواب (به سختی خواب می‌روم، در خواب بیدار می‌شوم یا خیلی زیاد می‌خوابم)",
  "احساس خستگی، پایین بودن انرژی دارم",
  "اختلال در اشتها (اشتهایم کم شده یا زیاد غذا می‌خورم)",
  "احساس بدی نسبت به خود دارم، احساس شکست می‌کنم، احساس می‌کنم خودم یا خانواده‌ام را ناامید کرده‌ام",
  "تمرکز در انجام کارها ندارم، مثلا زمانی که مطالعه می‌کنم یا تلویزیون می‌بینم",
  "حرکات یا صحبت کردنم به قدری آهسته است که دیگران متوجه آن می‌شوند یا برعکس، آنقدر بی‌قرارم که خیلی بیشتر از حد معمول در حرکتم",
  "افکاری در مورد مردن یا آسیب زدن به خود به سراغم می‌آید",
];

export default function PreRegister() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // برای پیگیری مرحله فعلی
  const [formData, setFormData] = useState<any>({}); // برای ذخیره داده‌ها
  const [gadData, setGadData] = useState<any>({}); // داده‌های GAD
  const [mddData, setMddData] = useState<any>({}); // داده‌های MDD

  const formStep1 = useForm<z.infer<typeof Step1Schema>>({
    resolver: zodResolver(Step1Schema),
    defaultValues: {
      phoneNumber: "", // مقدار پیش‌فرض خالی
      password: "", // مقدار پیش‌فرض خالی
      firstName: "",
      lastName: "",
      nickName: "",
      email: "",
      gender: undefined, // پیش‌فرض: انتخاب نشده
      dateOfBirth: undefined, // پیش‌فرض: انتخاب نشده
      education: undefined, // پیش‌فرض: انتخاب نشده
      city: "",
    },
  });

  const formStep2 = useForm<z.infer<typeof Step2Schema>>({
    resolver: zodResolver(Step2Schema),
    defaultValues: {
      diseaseType: undefined,
      organ: undefined,
      patientStatus: undefined,
      stage: "",
      pathologyDiagnosis: "",
      initialWeight: 0,
      sleepDuration: undefined,
      appetiteLevel: undefined,
    },
  });

  const formGAD = useForm<z.infer<typeof GADSchema>>({
    resolver: zodResolver(GADSchema),
    defaultValues: {
      gadAnswers: gadQuestions.map(() => ({
        questionId: "",
        answerValue: undefined, // مقدار پیش‌فرض خالی
      })),
    },
  });
  const formMDD = useForm<z.infer<typeof MDDSchema>>({
    resolver: zodResolver(MDDSchema),
    defaultValues: {
      mddAnswers: mddQuestions.map(() => ({
        questionId: "",
        answerValue: undefined, // مقدار پیش‌فرض خالی
      })),
    },
  });

  const gadFieldArray = useFieldArray({
    control: formGAD.control,
    name: "gadAnswers", // نام آرایه‌ای که در GADSchema تعریف شده
  });
  const mddFieldArray = useFieldArray({
    control: formMDD.control,
    name: "mddAnswers", // نام آرایه‌ای که در GADSchema تعریف شده
  });

  const registerMutation = useMutation({
    mutationFn: preRegisterPatient,
    onSuccess: (data) => {
      toast("ثبت نام با موفقیت انجام شد. پس از تایید اطلاعات توسط اپراتور شما میتوانید به سامانه وارد شوید.", {
        className: "!bg-green-500 !text-white",
      });
      router.push("/UserPanel/ControllerDashboard"); // هدایت به داشبورد پس از ثبت نام موفق
    },
    onError: (error) => {
      toast("خطا در ثبت نام. لطفا دوباره تلاش کنید.", {
        className: "!bg-red-500 !text-white",
      });
    },
  });

  const onSubmitStep1 = (data: z.infer<typeof Step1Schema>) => {
    setFormData({ ...formData, ...data });
    setCurrentStep(2); // رفتن به مرحله 2
  };

  const onSubmitStep2 = (data: z.infer<typeof Step2Schema>) => {
    setFormData({ ...formData, ...data });
    setCurrentStep(3);
    //const finalData = { ...formData, ...data };
    // setLoading(true);
    // registerMutation.mutate(finalData);
  };

  const onSubmitGAD = (data: z.infer<typeof GADSchema>) => {
    setGadData(data); // ذخیره داده‌های GAD
    setCurrentStep(4); // رفتن به مرحله MDD
  };

  const onSubmitMDD = (data: z.infer<typeof MDDSchema>) => {
    const gadScore = calculateGADScore(gadData);
    const mddScore = calculateMDDScore(data);

    const payload = {
      username: formData.phoneNumber,
      password: formData.password,
      phoneNumber: formData.phoneNumber,
      nationalId: formData.nationalId || "",
      firstName: formData.firstName,
      lastName: formData.lastName,
      dateOfBirth: formData.dateOfBirth,
      gender: parseInt(formData.gender),
      education: formData.education ? parseInt(formData.education) : 0,
      city: formData.city,
      organ: parseInt(formData.organ),
      diseaseType: formData.diseaseType ? parseInt(formData.diseaseType) : 0,
      patientStatus: parseInt(formData.patientStatus),
      stage: formData.stage ? parseInt(formData.stage) : undefined,
      pathologyDiagnosis: formData.pathologyDiagnosis || "",
      initialWeight: formData.initialWeight
        ? parseFloat(formData.initialWeight)
        : 0,
      sleepDuration: formData.sleepDuration
        ? parseFloat(formData.sleepDuration)
        : undefined,
      appetiteLevel: parseInt(formData.appetiteLevel),
      gadScore: gadScore,
      mddScore: mddScore,
    };
    setLoading(true);
    registerMutation.mutate(payload);
  };

  const calculateGADScore = (data: z.infer<typeof GADSchema>) => {
    return data.gadAnswers.reduce(
      (total: number, answer) => total + answer.answerValue,
      0
    );
  };

  const calculateMDDScore = (data: z.infer<typeof MDDSchema>) => {
    return data.mddAnswers.reduce(
      (total: number, answer) => total + answer.answerValue,
      0
    );
  };

  return (
    <div className="grid w-screen h-screen bg-center bg-cover bg-no-repeat bg-[url('/img/login-pattern.png')] place-content-center">
      <div className="w-full sm:w-[40rem] md:w-[50rem] lg:w-[60rem] xl:w-[70rem] bg-white rounded-lg dark:border xl:p-0 dark:bg-gray-800 dark:border-gray-700 shadow-[0px_0px_15px_0px_#00000040] h-fit relative">
        {loading && (
          <div className="absolute top-3 left-5 bg-transparent">
            <Oval
              visible={true}
              height="30"
              width="30"
              color="#003778"
              ariaLabel="oval-loading"
            />
          </div>
        )}
        <div className="flex flex-col justify-center h-full p-10 space-y-6 md:space-y-8 md:py-10 md:px-12 lg:px-16">
          {/* <p className="text-lg font-semibold text-center text-blue dark:text-white">
          لطفا اطلاعات خود را تکمیل نمایید
        </p> */}
          <p className="text-lg font-semibold text-center text-blue dark:text-white">
            {currentStep === 1
              ? "لطفا اطلاعات شخصی خود را تکمیل کنید"
              : currentStep === 2
              ? "هر چه اطلاعات دقیق تری را با ما به اشتراک بگذارید، بهتر می توانیم به شما کمک کنیم"
              : currentStep === 3
              ? "در طی دو هفته گذشته، چقدر مشکلات زیر برای شما آزار دهنده بوده است؟"
              : "در طی دو هفته گذشته، چه میزان مشکلات (موارد) زیر برای شما آزار دهنده بوده است؟ (برای شما اتفاق افتاده است)"}
          </p>

          <Form {...formStep1}>
            <form
              onSubmit={
                currentStep === 1
                  ? formStep1.handleSubmit(onSubmitStep1)
                  : currentStep === 2
                  ? formStep2.handleSubmit(onSubmitStep2)
                  : currentStep === 3
                  ? formGAD.handleSubmit(onSubmitGAD)
                  : formMDD.handleSubmit(onSubmitMDD)
              }
              className="space-y-5"
            >
              {/* مرحله 1 */}
              {currentStep === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* شماره همراه */}
                  <FormField
                    control={formStep1.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-blue dark:text-white text-right">
                          شماره همراه <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="شماره همراه خود را وارد نمایید"
                            type="tel"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* رمز عبور */}
                  <FormField
                    control={formStep1.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-blue dark:text-white text-right">
                          رمز عبور <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="رمز عبور خود را وارد نمایید"
                            type="password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* فیلدهای قبلی */}
                  <FormField
                    control={formStep1.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-blue dark:text-white text-right">
                          نام
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="نام خود را وارد نمایید"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={formStep1.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-blue dark:text-white text-right">
                          نام خانوادگی
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="نام خانوادگی خود را وارد نمایید"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={formStep1.control}
                    name="nickName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-blue dark:text-white text-right">
                          نام مستعار <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="نامی که میخواهید به دیگران نشان داده شود را وارد نمایید"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={formStep1.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-blue dark:text-white text-right">
                          ایمیل <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="ایمیل خود را وارد نمایید"
                            type="email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={formStep1.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-blue dark:text-white text-right">
                          جنسیت <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="w-full p-2 border border-blue/30 rounded-md text-sm"
                          >
                            <option value="">انتخاب کنید</option>
                            <option value="1">مرد</option>
                            <option value="2">زن</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* <FormField
                    control={formStep1.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-blue dark:text-white text-right">
                          تاریخ تولد <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
                  <FormField
                    control={formStep1.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-blue dark:text-white text-right">
                          تاریخ تولد <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <DatePicker
                            calendar={persian} // تقویم شمسی
                            locale={persian_fa} // زبان فارسی
                            className="w-full p-2 border border-blue/30 rounded-md text-sm"
                            containerClassName="w-full"
                            inputClass="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" // استایل ورودی
                            value={field.value || null} // مقدار پیش‌فرض
                            onChange={(date) => field.onChange(date?.isValid ? date.toDate() : null)} // تبدیل به مقدار تاریخ میلادی
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={formStep1.control}
                    name="education"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-blue dark:text-white text-right">
                          تحصیلات <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="w-full p-2 border border-blue/30 rounded-md text-sm"
                          >
                            <option value="">انتخاب کنید</option>
                            <option value="0">بدون تحصیلات</option>
                            <option value="1">دیپلم</option>
                            <option value="2">لیسانس</option>
                            <option value="3">فوق لیسانس</option>
                            <option value="4">دکتری</option>
                            <option value="5">سایر</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formStep1.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-blue dark:text-white text-right">
                          شهر محل سکونت
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="شهر محل سکونت خود را وارد نمایید"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* مرحله 2 */}
              {currentStep === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={formStep2.control}
                    name="diseaseType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-blue dark:text-white text-right">
                          نوع بیماری <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="w-full p-2 border border-blue/30 rounded-md text-sm"
                          >
                            <option value="">انتخاب کنید</option>
                            <option value="1">خوشخیم</option>
                            <option value="2">بدخیم</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={formStep2.control}
                    name="organ"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-blue dark:text-white text-right">
                          ارگان درگیر <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="w-full p-2 border border-blue/30 rounded-md text-sm"
                          >
                            <option value="">انتخاب کنید</option>
                            <option value="1">تخمدان</option>
                            <option value="2">پستان</option>
                            <option value="3">پروستات</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={formStep2.control}
                    name="patientStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-blue dark:text-white text-right">
                          وضعیت بیماری <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="w-full p-2 border border-blue/30 rounded-md text-sm"
                          >
                            <option value="">انتخاب کنید</option>
                            <option value="1">تازه تشخیص</option>
                            <option value="2">تحت درمان</option>
                            <option value="3"> تکمیل درمان </option>
                            <option value="4">عود بیماری</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formStep2.control}
                    name="stage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-blue dark:text-white text-right">
                          آیا از سطح ( stage ) بیماری خود اطلاع دارید؟
                        </FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="w-full p-2 border border-blue/30 rounded-md text-sm"
                          >
                            <option value="">انتخاب کنید</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formStep2.control}
                    name="pathologyDiagnosis"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-blue dark:text-white text-right">
                          تشخیص پاتولوژی
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="آیا از تشخیص پاتولوژی خود اطلاع دارید؟ نوشته شود"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formStep2.control}
                    name="initialWeight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-blue dark:text-white text-right">
                          وزن اولیه
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            placeholder="وزن اولیه"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formStep2.control}
                    name="sleepDuration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-blue dark:text-white text-right">
                          مدت خوابیدن
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            placeholder="مدت خوابیدن"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formStep2.control}
                    name="appetiteLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-blue dark:text-white text-right">
                          میزان اشتها <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="w-full p-2 border border-blue/30 rounded-md text-sm"
                          >
                            <option value="">انتخاب کنید</option>
                            <option value="1"> زیاد</option>
                            <option value="2"> معمولی</option>
                            <option value="3"> بی‌اشتها</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {currentStep === 3 && (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px] text-xs text-right text-gray-500 border border-gray-300 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="w-[65%] px-4 py-2">
                          سوال
                        </th>
                        <th scope="col" className="w-[8.75%] px-4 py-2">
                          هیچ وقت (۰)
                        </th>
                        <th scope="col" className="w-[8.75%] px-4 py-2">
                          بعضی از روزها (۱)
                        </th>
                        <th scope="col" className="w-[8.75%] px-4 py-2">
                          بیشتر از نیمی از ایام (۲)
                        </th>
                        <th scope="col" className="w-[8.75%] px-4 py-2">
                          تقریبا هر روز (۳)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {gadFieldArray.fields.map((field, index) => (
                        <tr
                          key={field.id}
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                        >
                          <td className="w-[65%] px-4 py-2 font-medium text-gray-900 dark:text-white break-words align-middle">
                            {gadQuestions[index]}
                          </td>
                          {[0, 1, 2, 3].map((value) => (
                            <td
                              key={value}
                              className="w-[8.75%] px-4 py-2 align-middle text-center"
                            >
                              <FormField
                                control={formGAD.control}
                                name={`gadAnswers.${index}.answerValue`}
                                render={({ field }) => (
                                  <input
                                    {...field}
                                    type="radio"
                                    value={value}
                                    className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                                    checked={field.value === value}
                                    onChange={(e) =>
                                      field.onChange(Number(e.target.value))
                                    }
                                  />
                                )}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {currentStep === 4 && (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px] text-xs text-right text-gray-500 border border-gray-300 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="w-[65%] px-4 py-2">
                          سوال
                        </th>
                        <th scope="col" className="w-[8.75%] px-4 py-2">
                          هیچ وقت (۰)
                        </th>
                        <th scope="col" className="w-[8.75%] px-4 py-2">
                          بعضی از روزها (۱)
                        </th>
                        <th scope="col" className="w-[8.75%] px-4 py-2">
                          بیشتر از نیمی از ایام (۲)
                        </th>
                        <th scope="col" className="w-[8.75%] px-4 py-2">
                          تقریبا هر روز (۳)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {mddFieldArray.fields.map((field, index) => (
                        <tr
                          key={field.id}
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                        >
                          <td className="w-[65%] px-4 py-2 font-medium text-gray-900 dark:text-white break-words align-middle">
                            {mddQuestions[index]}
                          </td>
                          {[0, 1, 2, 3].map((value) => (
                            <td
                              key={value}
                              className="w-[8.75%] px-4 py-2 align-middle text-center"
                            >
                              <FormField
                                control={formMDD.control}
                                name={`mddAnswers.${index}.answerValue`}
                                render={({ field }) => (
                                  <input
                                    {...field}
                                    type="radio"
                                    value={value}
                                    className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                                    checked={field.value === value}
                                    onChange={(e) =>
                                      field.onChange(Number(e.target.value))
                                    }
                                  />
                                )}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* دکمه‌ها */}
              <div className="flex justify-between mt-5">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    className="w-1/3 p-2 text-white transition bg-gray-500 hover:bg-gray-600 rounded-xl"
                    onClick={() => setCurrentStep(currentStep - 1)}
                  >
                    برگشت
                  </Button>
                )}
                <Button
                  type="submit"
                  className="w-1/3 p-2 text-white transition bg-blue hover:bg-blue/90 rounded-xl"
                >
                  {currentStep === 4 ? "ارسال اطلاعات" : "ادامه به مرحله بعد"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
