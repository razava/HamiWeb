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
  ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import jalaliday from "jalaliday";
import { backgroundColor, borderColor } from "@/constants/colors";
import ChartDataLabels from "chartjs-plugin-datalabels";
dayjs.extend(jalaliday);
dayjs.extend(utc);
ChartJS.defaults.font.family = "Yekan";
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

// export const options = {
//   responsive: true,
//   plugins: {
//     legend: {
//       position: "top" as const,
//     },
//     title: {
//       display: true,
//       text: "Chart.js Line Chart",
//     },
//   },
// };

const labels = ["January", "February", "March", "April", "May", "June", "July"];

export const data = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      label: "Dataset 2",
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};

interface Values {
  title: string;
  value: string;
  displayValue: string;
  parameters: any;
}

export default function LineChart({
  chartData,
  chartTitle,
}: {
  chartData: { title: string; icon: string; values: Values[] }[];
  chartTitle: string;
}) {
  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { x: { ticks: { autoSkip: false } } },
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: chartTitle,
        position: "bottom",
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
    },
  };

  const data = {
    labels: chartData[0].values.map((item) => {
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

  return <Line options={options} data={data} className="h-[20rem] " />;
}
