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
        align: "end" as const, // مقدار صحیح برای align
        anchor: "end" as const, // مقدار صحیح برای anchor
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

  const data = {
    labels: ["", ...chartData[0].values.map((item) => item.title)], // اضافه کردن dummy label
    datasets: chartData.map((serie, index) => ({
      label: serie.title, // عنوان سری (GAD یا MDD)
      data: [null, ...serie.values.map((item) => parseInt(item.value))], // اضافه کردن فضای خالی برای هماهنگ‌سازی با dummy label
      backgroundColor: `rgba(${index * 200}, 100, 200, 0.5)`, // رنگ خط
      borderColor: `rgba(${index * 200}, 100, 200, 1)`, // رنگ حاشیه
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
