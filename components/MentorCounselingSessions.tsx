"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  getMentorCounselingSessions,
  getMentorPatientGroups,
} from "@/utils/adminApi";
import { Triangle } from "react-loader-spinner";
import { convertFullTime } from "@/lib/utils";

// رنگ‌بندی جلسات بر اساس وضعیت
const sessionColor = (scheduledDate: string, isConfirmed: boolean) => {
  const now = new Date();
  const sessionDate = new Date(scheduledDate);

  if (isConfirmed) {
    return "bg-blue-50"; // جلسه تایید شده (برگزار شده)
  } else if (sessionDate < now) {
    return "bg-pink-50"; // جلسه منقضی شده
  } else {
    return "bg-green-50"; // جلسه آینده (در حال برگزاری)
  }
};

// تابع تعیین وضعیت جلسه
const getSessionStatus = (scheduledDate: string, isConfirmed: boolean) => {
  const now = new Date();
  const sessionDate = new Date(scheduledDate);

  if (isConfirmed) {
    return "برگزار شده";
  } else if (sessionDate < now) {
    return "منقضی شده";
  } else {
    return "در حال برگزاری";
  }
};

export default function MentorCounselingSessions() {
  const router = useRouter();

  const [selectedGroup, setSelectedGroup] = useState<string | null>(null); // گروه انتخاب‌شده

  // مقدار اولیه را از localStorage بخوانید
  useEffect(() => {
    const savedGroup = localStorage.getItem("selectedGroup");
    if (savedGroup) {
      setSelectedGroup(savedGroup);
    }
  }, []);

  // گرفتن لیست جلسات
  const { data: sessions, isLoading: isSessionsLoading } = useQuery({
    queryKey: ["CounselingSessions", selectedGroup],
    queryFn: async () => {
      const response = await getMentorCounselingSessions(selectedGroup);
      return response;
    },
    enabled: !!selectedGroup, // فعال‌سازی درخواست فقط در صورت انتخاب گروه
  });

  // گرفتن لیست گروه‌ها
  const { data: groups, isLoading: isGroupsLoading } = useQuery({
    queryKey: ["PatientGroups"],
    queryFn: getMentorPatientGroups,
  });

  // مدیریت تغییر گروه و ذخیره در localStorage
  const handleGroupChange = (groupId: string | null) => {
    setSelectedGroup(groupId);
    if (groupId) {
      localStorage.setItem("selectedGroup", groupId); // ذخیره در localStorage
    } else {
      localStorage.removeItem("selectedGroup"); // حذف مقدار ذخیره‌شده
    }
  };

  return (
    <div className="w-full min-h-screen p-6 flex flex-col items-center bg-[#f9f9f9] mt-20">
      <div className="w-full max-w-7xl bg-white rounded-lg shadow-md p-6">
        {/* فیلتر گروه */}
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            فیلتر بر اساس گروه:
          </label>
          <select
            value={selectedGroup || ""}
            onChange={(e) => handleGroupChange(e.target.value || null)}
            className="w-full p-2 border rounded-md"
          >
            <option value="">همه گروه‌ها</option>
            {isGroupsLoading ? (
              <option>در حال بارگذاری...</option>
            ) : (
              Array.isArray(groups) &&
              groups.map((group: any) => (
                <option key={group.id} value={group.id}>
                  {group.description}
                </option>
              ))
            )}
          </select>
        </div>

        {/* نمایش جلسات */}
        {isSessionsLoading ? (
          <div className="flex justify-center">
            <Triangle
              height="80"
              width="80"
              color="#4fa94d"
              ariaLabel="triangle-loading"
              visible={true}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sessions?.length > 0 ? (
              sessions.map((session: any) => {
                const sessionStatus = getSessionStatus(
                  session.scheduledDate,
                  session.isConfirmed
                );

                return (
                  <div
                    key={session.id}
                    className={`p-4 shadow-md rounded-lg border border-gray-300 ${sessionColor(
                      session.scheduledDate,
                      session.isConfirmed
                    )}`}
                  >
                    <h3 className="text-lg font-bold text-blue-800">
                      {session.topic}
                    </h3>
                    <p className="text-sm text-gray-500 mt-2">
                      <span className="font-semibold text-gray-700">گروه: </span>
                      {session.patientGroupName}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      <span className="font-semibold text-gray-700">
                        تاریخ و ساعت:
                      </span>{" "}
                      {convertFullTime(session.scheduledDate)}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      <span className="font-semibold text-gray-700">وضعیت:</span>{" "}
                      {sessionStatus}
                    </p>

                    {/* لینک جلسه فقط برای جلساتی که هنوز برگزار نشده‌اند */}
                    {!session.isConfirmed &&
                      sessionStatus === "در حال برگزاری" && (
                        <a
                          href={session.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-700 underline"
                        >
                          لینک جلسه
                        </a>
                      )}

                    {/* دکمه‌ها برای وضعیت‌های مختلف */}
                    <div className="mt-4 flex justify-end gap-4">
                      {!session.isConfirmed ? (
                        <button
                          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-md"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(
                              `/UserPanel/ControllerDashboard/CounselingSessions/${session.id}/SubmitAttendanceLog`
                            );
                          }}
                        >
                          تایید برگزاری جلسه
                        </button>
                      ) : (
                        <button
                          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium rounded-md"
                          onClick={() =>
                            router.push(
                              `/UserPanel/ControllerDashboard/CounselingSessions/${session.id}/ReportAttendanceLog`
                            )
                          }
                        >
                          گزارش جلسه
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-500">هیچ جلسه‌ای یافت نشد.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
