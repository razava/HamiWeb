"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getSessionReportByUserId } from "@/utils/adminApi";
import { Triangle } from "react-loader-spinner";
import { convertFullTime } from "@/lib/utils";

interface Session {
  id: string;
  topic: string;
  scheduledDate: string; // تاریخ و ساعت جلسه
  attendanceStatus: boolean; // آیا کاربر حاضر بوده؟
  mentorNote: string | null; // یادداشت منتور
  mentorName: string | null; // نام منتور
  patientGroupName: string; // نام گروه
  meetingLink: string | null; // لینک جلسه
}

export default function MySessionReport() {
  const { data, isLoading } = useQuery({
    queryKey: ["SessionReport", ""],
    queryFn: () => getSessionReportByUserId(""),
    refetchOnWindowFocus: false,
  });

  const isSessionUpcoming = (scheduledDate: string) => {
    const now = new Date();
    const sessionDate = new Date(scheduledDate);
    return sessionDate > now; // اگر تاریخ جلسه از اکنون بزرگ‌تر باشد، پیش‌رو است
  };

  return (
    <div className="w-[95vw] lg:w-[82vw] xl:w-[70vw] mx-auto mt-12">
      {/* عنوان صفحه */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-blue-900">
          برنامه جلسات گروه درمانی
        </h2>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data?.map((session: Session, index: number) => {
                const upcoming = isSessionUpcoming(session.scheduledDate);
                return (
                  <div
                    key={session.id}
                    className={`p-4 shadow-md rounded-lg border border-gray-300 ${
                      upcoming
                        ? "bg-green-50" // رنگ جلسات پیش‌رو
                        : "bg-pink-50" // رنگ جلسات برگزار شده
                    }`}
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

                    {/* تاریخ و ساعت جلسه */}
                    <p className="text-sm text-gray-500 mt-2">
                      <span className="font-semibold text-gray-700">
                        تاریخ و ساعت:{" "}
                      </span>
                      {convertFullTime(session.scheduledDate)}
                    </p>

                    {/* وضعیت حضور */}
                    {upcoming && (
                      <>
                        <p className="text-sm text-gray-500 mt-2">
                          <span className="font-semibold text-gray-700">
                            وضعیت حضور:{" "}
                          </span>
                          <span className="text-green-600 font-semibold">
                            جلسه هنوز برگزار نشده است
                          </span>
                        </p>
                        {/* دکمه باز کردن لینک جلسه */}
                        {session.meetingLink && (
                          <div className="flex justify-end">
                            <a
                              href={session.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-md"
                            >
                              ورود به جلسه
                            </a>
                          </div>
                        )}
                      </>
                    )}
                    {!upcoming && (
                      <p className="text-sm text-gray-500 mt-2">
                        <span className="font-semibold text-gray-700">
                          وضعیت حضور:{" "}
                        </span>
                        {session.attendanceStatus ? (
                          <span className="text-green-600 font-semibold">
                            حاضر
                          </span>
                        ) : (
                          <span className="text-red-600 font-semibold">
                            غایب
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                );
              })}
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
