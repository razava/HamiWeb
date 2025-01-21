"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getSessionUsers, submitAttendanceLogs } from "@/utils/adminApi";
import { Triangle } from "react-loader-spinner";
import { toast } from "sonner";
import { useRouter } from "next/navigation"; // ایمپورت useRouter

export default function MentorSessionAttendanceUsers({ sessionId }: { sessionId: string }) {
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false); // مدیریت وضعیت ارسال
  const router = useRouter(); // استفاده از useRouter

  // گرفتن لیست کاربران عضو گروه جلسه
  const { data: users, isLoading } = useQuery({
    queryKey: ["SessionUsers", sessionId],
    queryFn: () => getSessionUsers(sessionId),
  });

  // مقداردهی اولیه به attendanceData زمانی که کاربران بارگذاری می‌شوند
  useEffect(() => {
    if (users) {
      setAttendanceData(
        users.map((user: any) => ({
          userId: user.userId,
          attended: false, // مقدار پیش‌فرض برای حضور
          mentorNote: "", // مقدار پیش‌فرض برای یادداشت
        }))
      );
    }
  }, [users]);

  // Mutation ثبت حضور و غیاب
  const mutation = useMutation({
    mutationFn: submitAttendanceLogs,
    onSuccess: (data) => {
      toast.success("حضور و غیاب با موفقیت ثبت شد!");
      setIsSubmitted(true); // غیر فعال کردن دکمه پس از ثبت موفق
    },
    onError: (error) => {
      toast.error("خطا در ثبت حضور و غیاب!");
    },
  });

  // هندل کردن تغییر وضعیت حضور
  const handleAttendanceChange = (userId: string, attended: boolean) => {
    setAttendanceData((prev) =>
      prev.map((data) =>
        data.userId === userId ? { ...data, attended } : data
      )
    );
  };

  // هندل کردن تغییر یادداشت
  const handleNoteChange = (userId: string, note: string) => {
    setAttendanceData((prev) =>
      prev.map((data) =>
        data.userId === userId ? { ...data, mentorNote: note } : data
      )
    );
  };

  // ارسال داده‌ها به سرور
  const handleSubmit = () => {
    mutation.mutate({
      sessionId,
      attendanceLogs: attendanceData,
    });
  };

  // اگر هنوز لیست کاربران بارگذاری نشده است
  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Triangle height="80" width="80" color="#4fa94d" ariaLabel="loading" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-6 rounded shadow">
      {/* دکمه بازگشت */}
      <button
        onClick={() => router.back()} // بازگشت به صفحه قبلی
        className="px-4 py-2 mb-4 text-white bg-gray-500 rounded hover:bg-gray-600"
      >
        بازگشت
      </button>

      <h2 className="text-xl font-bold mb-6">ثبت حضور و غیاب جلسه</h2>

      {/* جدول کاربران */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 border">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-4 py-2">نام</th>
              <th className="px-4 py-2">نام خانوادگی</th>
              <th className="px-4 py-2">نام کاربری</th>
              <th className="px-4 py-2">وضعیت حضور</th>
              <th className="px-4 py-2 w-1/2">یادداشت منتور</th> {/* عرض 50٪ */}
            </tr>
          </thead>
          <tbody>
            {users?.map((user: any) => (
              <tr key={user.userId} className="border-b">
                <td className="px-4 py-2">{user.firstName}</td>
                <td className="px-4 py-2">{user.lastName}</td>
                <td className="px-4 py-2">{user.userName}</td>
                <td className="px-4 py-2">
                  <select
                    value={
                      attendanceData.find((a) => a.userId === user.userId)?.attended
                        ? "حاضر"
                        : "غایب"
                    }
                    onChange={(e) =>
                      handleAttendanceChange(
                        user.userId,
                        e.target.value === "حاضر" ? true : false
                      )
                    }
                    className="p-2 border rounded"
                  >
                    <option value="حاضر">حاضر</option>
                    <option value="غایب">غایب</option>
                  </select>
                </td>
                <td className="px-4 py-2 w-1/2"> {/* عرض 50٪ */}
                  <input
                    type="text"
                    value={
                      attendanceData.find((a) => a.userId === user.userId)
                        ?.mentorNote || ""
                    }
                    onChange={(e) => handleNoteChange(user.userId, e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="یادداشت..."
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isSubmitted} // غیر فعال کردن دکمه بعد از ثبت موفق
        className={`px-4 py-2 mt-6 rounded ${
          isSubmitted
            ? "bg-gray-400 text-white cursor-not-allowed"
            : "bg-green-500 text-white hover:bg-green-600"
        }`}
      >
        {isSubmitted ? "ثبت شد" : "ثبت حضور و غیاب"}
      </button>
    </div>
  );
}
