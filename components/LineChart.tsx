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
import moment from "jalali-moment";


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
  value: string; // امتیاز تست
  displayValue: string; // توضیح کیفی امتیاز
}

interface ChartData {
  title: string; // عنوان سری (GAD یا MDD)
  values: DataItem[]; // داده‌های سری
}

export default function LineChart({
  chartData,
  chartTitle,
}: {
  chartData: ChartData[];
  chartTitle: string;
}) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { ticks: { autoSkip: false } },
    },
    plugins: {
      legend: {
        position: "top" as const, // موقعیت توضیحات نمودار
      },
      title: {
        display: true,
        text: chartTitle,
        position: "bottom" as const, // موقعیت عنوان نمودار
      },
      datalabels: {
        display: true,
        color: "black",
        align: "end" as const,
        anchor: "end" as const,
        font: { size: 10 },
        formatter: function (value: number, context: any) {
          const index = context.dataIndex;
          const datasetIndex = context.datasetIndex;
          const dataPoint = chartData[datasetIndex]?.values[index - 1]; // هماهنگ‌سازی با dummy label
          return dataPoint?.displayValue || ""; // توضیحات کیفی را نشان می‌دهد
        },
      },
    },
  };

  // 🎨 **پالت رنگی برای خطوط نمودار**
  const colorPalette = [
    "rgba(54, 162, 235, 1)",  // آبی روشن
    "rgba(255, 206, 86, 1)",  // زرد
    "rgba(75, 192, 192, 1)",  // سبز
    "rgba(153, 102, 255, 1)", // بنفش
    "rgba(255, 159, 64, 1)",  // نارنجی
    "rgba(255, 99, 132, 1)",  // قرمز تیره

  ];

  const data = {
    labels: ["", ...chartData[0].values.map((item) => moment(item.title).format("jYYYY/jMM/jDD") )], // اضافه کردن dummy label
    datasets: chartData.map((serie, index) => {
      const color = colorPalette[index % colorPalette.length]; // تخصیص رنگ‌ها با استفاده از مدولوس
      return {
        label: serie.title, // عنوان سری (GAD یا MDD)
        data: [null, ...serie.values.map((item) => parseInt(item.value))], // اضافه کردن فضای خالی برای هماهنگ‌سازی با dummy label
        backgroundColor: color.replace(", 1)", ", 0.5)"), // رنگ پس‌زمینه با شفافیت
        borderColor: color, // رنگ خط اصلی
        borderWidth: 2,
        tension: 0.4, // خطوط نرم بین نقاط
        pointBackgroundColor: color, // رنگ نقاط
        pointBorderColor: "#fff",
        pointRadius: 5, // اندازه نقاط
      };
    }),
  };

  return (
    <div className="h-[25rem] w-full">
      <Line options={options} data={data} />
    </div>
  );
}
