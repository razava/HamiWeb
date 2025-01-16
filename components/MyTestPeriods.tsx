"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Triangle } from "react-loader-spinner";
import { useRouter } from "next/navigation";
import { convertDate } from "@/lib/utils"; // تبدیل تاریخ
import { getTestPeriodsByUserId } from "@/utils/adminApi";

interface Test {
  id: string;
  testType: string; // نوع آزمون (GAD, MDD, MOOD)
  periodName: string; // نام دوره
  startDate: string; // تاریخ شروع
  endDate: string; // تاریخ پایان
  hasParticipated: boolean; // آیا کاربر شرکت کرده؟
}

export default function MyTestPeriods() {
  const router = useRouter();

  // گرفتن لیست آزمون‌ها از سرور
 
  const { data: tests, isLoading } = useQuery({
      queryKey: ["MyTests", ""],
      queryFn: () => getTestPeriodsByUserId(""),
      refetchOnWindowFocus: false,
    });

  // چک کردن اینکه آزمون قابل شرکت است یا نه
  const isTestActive = (startDate: string, endDate: string, hasParticipated: boolean) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    return now >= start && now <= end && !hasParticipated; // زمان در بازه و شرکت نکرده
  };

  return (
    <div className="w-[95vw] lg:w-[82vw] xl:w-[70vw] mx-auto mt-12">
      {/* عنوان صفحه */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-blue-900">آزمون‌های شما</h2>
      </div>

      {/* نمایش لودینگ در حال بارگذاری */}
      {isLoading ? (
        <div className="flex justify-center items-center w-full h-screen bg-transparent">
          <Triangle
            visible={true}
            height="100"
            width="100"
            color="#003778"
            ariaLabel="triangle-loading"
          />
        </div>
      ) : (
        <>
          {tests?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tests.map((test: Test, index: number) => {
                const active = isTestActive(test.startDate, test.endDate, test.hasParticipated);
                return (
                  <div
                    key={test.id}
                    className={`p-4 shadow-md rounded-lg border border-gray-300 ${
                      active ? "bg-green-50" : "bg-gray-100"
                    }`}
                  >
                    {/* عنوان آزمون */}
                    <h3 className="text-md font-bold text-blue-800">{test.periodName}</h3>

                    {/* نوع آزمون */}
                    {/* <p className="text-sm text-gray-500 mt-2">
                      <span className="font-semibold text-gray-700">نوع آزمون: </span>
                      {test.testType}
                    </p> */}

                    {/* تاریخ شروع و پایان */}
                    <p className="text-sm text-gray-500 mt-2">
                      <span className="font-semibold text-gray-700">تاریخ شروع: </span>
                      {convertDate(test.startDate)}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      <span className="font-semibold text-gray-700">تاریخ پایان: </span>
                      {convertDate(test.endDate)}
                    </p>

                    {/* وضعیت شرکت در آزمون */}
                    <p className="text-sm text-gray-500 mt-2">
                      <span className="font-semibold text-gray-700">وضعیت: </span>
                      {test.hasParticipated ? (
                        <span className="text-green-600 font-semibold">شرکت کرده‌اید</span>
                      ) : (
                        <span className="text-red-600 font-semibold">شرکت نکرده‌اید</span>
                      )}
                    </p>

                    {/* دکمه شرکت در آزمون */}
                    {active && (
                      <div className="flex justify-end">
                      <button
                       onClick={() => router.push(`/UserPanel/PatientDashboard/MyTests/${test.id}?testType=${test.testType}`)}
                        className="inline-block mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-md"
                      >
                        شرکت در آزمون
                      </button>
                    </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            // نمایش پیام اگر لیست خالی است
            <div className="text-center text-gray-500 mt-10">
              <p>هیچ آزمونی یافت نشد.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
