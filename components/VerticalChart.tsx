"use client";
import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ScaleChartOptions,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import jalaliday from "jalaliday";
import { backgroundColor, borderColor } from "@/constants/colors";
dayjs.extend(jalaliday);
dayjs.extend(utc);
// import faker from "faker";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
ChartJS.defaults.font.family = "Yekan";
interface Values {
  displayValue: string;
  parameters: string;
  title: string;
  value: string;
}
function getRandomColor(n: number) {
  var letters = "0123456789ABCDEF".split("");
  var color = "#";
  var colors = [];
  for (var j = 0; j < n; j++) {
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    colors.push(color);
    color = "#";
  }
  return colors;
}
function BarChart({
  chartData,
  chart,
  chartTitle,
}: {
  chartData: { title: string; icon: string; values: Values[] }[];
  chart?: number;
  chartTitle: string;
}) {
  const DataSets = [];
  // if (chartTitle == "درخواست های سی روز گذشته") {
  //   var labels = chartData[1].values.map((item) => {
  //     return item.title;
  //   });

  //   var label1 = chartData[0].title;
  //   var label2 = chartData[1].title;
  //   var value1 = chartData[0].values.map((item) => Number(item.value));
  //   var value2 = chartData[1].values.map((item) => Number(item.value));
  //   DataSets.push({ label: label1, data: value1 });
  //   DataSets.push({ label: label2, data: value2 });
  
  // } else if ("گزارش تعداد درخواست ها بر اساس نوع بیمه") {
  //   var labels = chartData[0].values.map((item) => {
  //     return item.title;
  //   });
  //   var label1 = "";
  //   var value1 = chartData[0].values.map((item) => Number(item.value));
  //   DataSets.push({ label: label1, data: value1 });
  
  // }
  const options: ChartOptions<"bar"> = {
    scales: { x: { ticks: { autoSkip: false } }, y: { stacked: false } },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: chartTitle,
        position: "bottom",
      },
      tooltip: {
        textDirection: "rtl",
      },
      datalabels: {
        display: true,
        color: "black",
        align: "end",
        anchor: "end",
        font: { size: 12 },
        formatter: function (value, context) {
          return value == 0 ? "" : value;
        },
      },
      // scales: {
      //   x: { ticks: { autoSkip: false } },
      //   y: {
      //     stacked: false,
      //     // suggestedMax:
      //     //   Math.max(
      //     //     ...chartData.map((l, j) => {
      //     //       const a = l.values.map((v) => {
      //     //         return Number(v.value);
      //     //       });
      //     //       const b = Math.max(...a);
      //     //       return l.values.map((v) => Number(v.value));
      //     //     })
      //     //   ) * 1.2,
      //   },
      // },
    },
  };

  const data = {
    labels: chartData[0]?.values?.map((item) => {
      return item.title;
    }),
    datasets: chartData.map((item: any, index: number) => {
      return {
        label: item.title,
        data: item.values.map((item: any) => item.value),
        backgroundColor: backgroundColor[index],
        borderColor: borderColor[index],
        borderWidth: 1,
      };
    }),
  };
  return (
    <Bar dir="rtl" className="min-h-[20rem]" options={options} data={data} />
  );
}

export default BarChart;
