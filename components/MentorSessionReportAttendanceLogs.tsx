"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Triangle } from "react-loader-spinner";
import { getSessionAttendanceLogs } from "@/utils/adminApi"; // فرض کنید این تابع API را فراخوانی می‌کند

export default function SessionAttendanceLog({ sessionId }: { sessionId: string }) {
  const router = useRouter();

  // گرفتن لاگ‌های جلسه
  const { data: logs, isLoading } = useQuery({
    queryKey: ["SessionAttendanceLogs", sessionId],
    queryFn: () => getSessionAttendanceLogs(sessionId),
  });

  // در حال بارگذاری
  if (isLoading) {
    return (
      <div className="flex justify-center mt-10">
        <Triangle
          height="80"
          width="80"
          color="#4fa94d"
          ariaLabel="triangle-loading"
          visible={true}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg mt-10">
      {/* دکمه بازگشت */}
      <button
        onClick={() => router.back()}
        className="px-4 py-2 mb-6 text-white bg-gray-500 rounded hover:bg-gray-600"
      >
        بازگشت
      </button>

      <h2 className="text-lg font-bold text-blue-800 mb-6">لاگ حضور و غیاب جلسه</h2>

      {/* جدول نمایش لاگ‌ها */}
      {logs?.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right text-gray-500 border border-gray-200">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-right">نام</th>
                <th className="px-4 py-2 text-right">نام خانوادگی</th>
                <th className="px-4 py-2 text-right">نام کاربری</th>
                <th className="px-4 py-2 text-right">وضعیت حضور</th>
                <th className="px-4 py-2 text-right">یادداشت منتور</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log: any) => (
                <tr key={log.userId} className="border-b">
                  <td className="px-4 py-2 text-right">{log?.firstName || "-"}</td>
                  <td className="px-4 py-2 text-right">{log?.lastName || "-"}</td>
                  <td className="px-4 py-2 text-right">{log?.userName || "-"}</td>
                  <td className="px-4 py-2 text-right">
                    {log.attended ? "حاضر" : "غایب"}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {log.mentorNote || "بدون یادداشت"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 text-center">هیچ لاگی برای این جلسه ثبت نشده است.</p>
      )}
    </div>
  );
}
