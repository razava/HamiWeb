"use client";

import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Triangle } from "react-loader-spinner";
import MoodPieChart from "@/components/MoodPieChart"; // کامپوننت گزارش دایره‌ای
import { getInfoByUserId } from "@/utils/infoApi";
import { submitDailyMood } from "@/utils/commonApi";

export default function PatientDashboard() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null); // حالت مود انتخابی
  const [loading, setLoading] = useState(false); // وضعیت ارسال فرم

  // گرفتن گزارش مود روزانه
  const {
    data: moodReport,
    isLoading: isLoadingReport,
    refetch,
  } = useQuery({
    queryKey: ["MoodReport"],
    queryFn: () => getInfoByUserId("5"),
    refetchOnWindowFocus: false,
  });

  // بررسی اینکه آیا مود امروز در ExtraData وجود دارد
  const todayMood = moodReport?.extraData?.TodayMood.isRecorded
    ? moodReport.extraData.TodayMood.score
    : null;

  // Mutation برای ارسال مود روزانه
  const mutation = useMutation({
    mutationFn: (mood: number) => submitDailyMood(mood),
    onSuccess: () => {
      setSelectedMood(null); // بازنشانی مود انتخاب‌شده
      refetch(); // به‌روزرسانی گزارش مود
    },
  });

  // هندل ثبت مود روزانه
  const handleMoodSubmit = async () => {
    if (selectedMood === null) {
      alert("لطفاً یک مود انتخاب کنید.");
      return;
    }
    setLoading(true);
    await mutation.mutateAsync(selectedMood);
    setLoading(false);
  };

  // ایموجی‌های مود و مقادیرشان
  const moodOptions = [
    { value: 4, emoji: "😄", label: "خیلی خوب" },
    { value: 3, emoji: "🙂", label: "خوب" },
    { value: 2, emoji: "😐", label: "معمولی" },
    { value: 1, emoji: "😟", label: "بد" },
    { value: 0, emoji: "😭", label: "خیلی بد" },
  ];

  return (
    <div className="w-[95vw] lg:w-[82vw] xl:w-[70vw] 3xl:w-[65vw] mx-auto mt-12 flex flex-col gap-8">
      {/* ثبت مود روزانه */}
      <div className="p-6 bg-white shadow-lg rounded-lg border border-gray-300 mt-10">
        <h2 className="text-lg font-bold text-blue-900 mb-4">خوش آمدی دوست عزیز</h2>
        <p className="text-sm text-gray-600 mb-6">حال شما امروز چطور است؟</p>

        {/* فقط وقتی مود امروز ثبت نشده باشد، دکمه‌های انتخاب و ثبت نمایش داده می‌شوند */}
        {todayMood === null ? (
          <>
            <div className="flex justify-around mb-4">
              {moodOptions.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => setSelectedMood(mood.value)}
                  className={`p-4 rounded-full border-2 text-2xl ${
                    selectedMood === mood.value
                      ? "border-green-500 bg-green-100"
                      : "border-gray-300 bg-gray-100"
                  }`}
                >
                  {mood.emoji}
                </button>
              ))}
            </div>

            <button
              onClick={handleMoodSubmit}
              disabled={loading}
              className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-md mt-5"
            >
              {loading ? "در حال ثبت..." : "ثبت مود روزانه"}
            </button>
          </>
        ) : (
          <div className="text-center">
            <p className="text-center text-gray-700 text-sm">
              {/* مود امروز شما:{" "} */}
              <span className="font-semibold text-blue-800 text-lg">
                {moodOptions.find((mood) => mood.value === todayMood)?.emoji}
              </span>
            </p>
            <p className="mt-2 text-sm text-gray-500">
              {moodOptions.find((mood) => mood.value === todayMood)?.label}
            </p>
          </div>
        )}
      </div>

      {/* گزارش مود روزانه */}
      <div className="p-6 bg-white shadow-lg rounded-lg border border-gray-300">
        <h2 className="text-lg font-bold text-blue-900 mb-4">
          گزارش مود روزانه شما در یک ماه گذشته
        </h2>
        {isLoadingReport ? (
          <div className="flex justify-center items-center">
            <Triangle
              visible={true}
              height="100"
              width="100"
              color="#003778"
              ariaLabel="triangle-loading"
            />
          </div>
        ) : moodReport?.charts?.length > 0 ? (
          <MoodPieChart
            moodData={moodReport.charts[0].series}
            chartTitle="مود روزانه در یک ماه گذشته"
          />
        ) : (
          <p className="text-sm text-gray-500">هیچ گزارشی یافت نشد.</p>
        )}
      </div>
    </div>
  );
}
