"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getSessionReportByUserId } from "@/utils/adminApi";
import { Triangle } from "react-loader-spinner";
import { useRouter } from "next/navigation";
import { convertFullTime } from "@/lib/utils";

interface Session {
  id: string;
  topic: string;
  scheduledDate: string; // تاریخ جلسه
  attendanceStatus: boolean; // آیا کاربر حاضر بوده؟
  mentorNote: string | null; // یادداشت منتور
  mentorName: string | null; // نام منتور
  patientGroupName: string; // نام گروه
}

export default function PatientsSessionReport({ userId }: { userId: string }) {
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["SessionReport", userId],
    queryFn: () => getSessionReportByUserId(userId),
    refetchOnWindowFocus: false,
  });

  return (
    <div className="w-[95vw] lg:w-[82vw] xl:w-[70vw] mx-auto mt-12">
      {/* عنوان صفحه */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-blue-900">
          گزارش حضور بیمار در جلسات برگزار شده
        </h2>
        <button
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-md"
          onClick={() => router.back()}
        >
          بازگشت
        </button>
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
          {data?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.map((session: Session, index: number) => (
                <div
                  key={session.id}
                  className="p-4 bg-white shadow-md rounded-lg border border-gray-300"
                >
                  {/* عنوان جلسه */}
                  <h3 className="text-md font-bold text-blue-800">
                    {index + 1}. {session.topic}
                  </h3>

                  {/* نام گروه */}
                  <p className="text-sm text-gray-500 mt-2">
                    <span className="font-semibold text-gray-700">
                      نام گروه:{" "}
                    </span>
                    {session.patientGroupName}
                  </p>

                  {/* نام منتور */}
                  <p className="text-sm text-gray-500 mt-2">
                    <span className="font-semibold text-gray-700">
                      نام منتور:{" "}
                    </span>
                    {session.mentorName}
                  </p>

                  {/* تاریخ جلسه */}
                  <p className="text-sm text-gray-500 mt-2">
                    <span className="font-semibold text-gray-700">تاریخ: </span>
                    {convertFullTime(session.scheduledDate)}
                  </p>

                  {/* وضعیت حضور */}
                  <p className="text-sm text-gray-500 mt-2">
                    <span className="font-semibold text-gray-700">
                      وضعیت حضور:{" "}
                    </span>
                    {session.attendanceStatus === null ? (
                      <span className="text-gray-500 font-semibold">-</span> // نمایش خط تیره در صورت نال بودن
                    ) : session.attendanceStatus ? (
                      <span className="text-green-600 font-semibold">حاضر</span> // اگر حاضر باشد
                    ) : (
                      <span className="text-red-600 font-semibold">غایب</span> // اگر غایب باشد
                    )}
                  </p>

                  {/* یادداشت منتور */}
                  <p className="text-sm text-gray-500 mt-2">
                    <span className="font-semibold text-gray-700">
                      یادداشت منتور:{" "}
                    </span>
                    {session.mentorNote || "-"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            // نمایش پیام اگر لیست خالی است
            <div className="text-center text-gray-500 mt-10">
              <p>هیچ موردی یافت نشد.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
