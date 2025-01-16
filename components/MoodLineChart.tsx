"use client";
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

interface DataItem {
  title: string; // تاریخ تست
  value: number; // امتیاز تست
}

interface ChartData {
  title: string; // عنوان سری
  values: DataItem[]; // داده‌ها
}

export default function MoodLineChart({
  chartData,
  chartTitle,
}: {
  chartData: ChartData[];
  chartTitle: string;
}) {
  // تعریف ایموجی‌ها برای مود روزانه
  const moodEmojis = {
    4: "😄", // خیلی خوب
    3: "🙂", // خوب
    2: "😐", // معمولی
    1: "😟", // بد
    0: "😢", // خیلی بد
  };

  // تنظیمات نمودار
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          autoSkip: false,
        },
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: chartTitle,
        position: "top" as const,
      },
      datalabels: {
        display: true,
        color: "black",
        align: "end" as const,
        anchor: "end" as const,
        font: { size: 16 }, // اندازه فونت ایموجی‌ها
        formatter: function (value: number) {
          // برگرداندن ایموجی مربوط به هر امتیاز
          return moodEmojis[value as keyof typeof moodEmojis] || "";
        },
      },
    },
  };

  // آماده‌سازی داده‌ها برای نمودار
  const data = {
    labels: chartData[0].values.map((item) => item.title), // تاریخ‌ها برای محور X
    datasets: chartData.map((serie, index) => ({
      label: serie.title, // عنوان سری
      data: serie.values.map((item) => item.value), // مقادیر
      backgroundColor: `rgba(${index * 100}, 100, 200, 0.5)`, // رنگ نقاط
      borderColor: `rgba(${index * 100}, 100, 200, 1)`, // رنگ خطوط
      borderWidth: 2,
      tension: 0.4, // خطوط نرم بین نقاط
    })),
  };

  return (
    <div className="h-[25rem] w-full">
      <Line options={options} data={data} />
    </div>
  );
}
