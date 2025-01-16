"use client";
import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip);

interface MoodPieChartProps {
  moodData: any[]; // داده‌های مود
  chartTitle: string; // عنوان نمودار
}

export default function MoodPieChart({ moodData, chartTitle }: MoodPieChartProps) {
  // محاسبه تعداد مودها برای هر حالت
  const moodCounts = moodData[0].values.reduce(
    (acc: any, item: any) => {
      acc[item.value] = (acc[item.value] || 0) + 1;
      return acc;
    },
    { "0": 0, "1": 0, "2": 0, "3": 0, "4": 0 }
  );

  // داده‌های نمودار Pie
  const data = {
    labels: ["خیلی بد", "بد", "متوسط", "خوب", "خیلی خوب"],
    datasets: [
      {
        label: "مود روزانه",
        data: [
          moodCounts["0"], // تعداد خیلی بد
          moodCounts["1"], // تعداد بد
          moodCounts["2"], // تعداد متوسط
          moodCounts["3"], // تعداد خوب
          moodCounts["4"], // تعداد خیلی خوب
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)", // رنگ برای خیلی بد
          "rgba(255, 159, 64, 0.2)", // رنگ برای بد
          "rgba(255, 205, 86, 0.2)", // رنگ برای متوسط
          "rgba(75, 192, 192, 0.2)", // رنگ برای خوب
          "rgba(54, 162, 235, 0.2)", // رنگ برای خیلی خوب
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(255, 205, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(54, 162, 235, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // ایموجی‌های مربوط به حالات مود
  const moodEmojis = ["😭", "😟", "😐", "🙂", "😄"];

  // رنگ‌های مربوط به راهنمای چارت
  const legendColors = [
    "rgba(255, 99, 132, 0.5)", // خیلی بد
    "rgba(255, 159, 64, 0.5)", // بد
    "rgba(255, 205, 86, 0.5)", // متوسط
    "rgba(75, 192, 192, 0.5)", // خوب
    "rgba(54, 162, 235, 0.5)", // خیلی خوب
  ];

  return (
    <div className="flex flex-col items-center w-full">
      {/* راهنمای چارت به همراه ایموجی‌ها */}
      <div className="flex justify-center gap-4 mb-4">
        {moodEmojis.map((emoji, index) => (
          <div key={index} className="flex items-center gap-2">
            {/* دایره رنگی */}
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: legendColors[index] }}
            ></div>
            {/* ایموجی */}
            <span className="text-lg">{emoji}</span>
          </div>
        ))}
      </div>

      {/* نمودار */}
      <div className="w-[18rem] h-[18rem]"> {/* محدود کردن سایز نمودار */}
        <Pie data={data} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>

      {/* عنوان نمودار */}
      <p className="mt-4 text-sm font-semibold text-gray-800">{chartTitle}</p>
    </div>
  );
}
