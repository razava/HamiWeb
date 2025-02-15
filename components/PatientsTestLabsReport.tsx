"use client";
import React from "react";
import BoxDashboard from "./BoxDashboard";
import LineChart from "./LineChart";
import { useQuery } from "@tanstack/react-query";
import { getInfoByUserId } from "@/utils/infoApi";
import { Triangle } from "react-loader-spinner"; // لودینگ
import { useRouter } from "next/navigation"; // مدیریت بازگشت
import { Button } from "@/components/ui/button"; // دکمه بازگشت

export default function PatientsTestLabsReport({
  userId,
}: {
  userId: string;
}) {
  const router = useRouter(); // استفاده از روتر برای بازگشت

  const { data, isLoading } = useQuery({
    queryKey: ["Infos"],
    queryFn: () => getInfoByUserId("7", userId),
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full h-screen bg-transparent">
        <Triangle
          visible={true}
          height="100"
          width="100"
          color="#003778"
          ariaLabel="triangle-loading"
        />
      </div>
    );
  }

  return (
    <div className="w-[95vw] lg:w-[82vw] xl:w-[70vw] 3xl:w-[65vw] mt-1 pt-9 mx-auto px-2">
      {/* دکمه بازگشت */}
      <div className="flex gap-4 ">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700"
        >
          بازگشت
        </Button>
      </div>

      {/* عنوان صفحه */}
      <h2 className="text-lg font-bold text-blue-900 text-center mb-2">
        ارزیابی آزمایش های بیمار
      </h2>

      {/* نمایش کارت‌ها و نمودارها */}
      <div className="w-full mb-6 flex-col gap-0 flex">
        {/* کارت‌ها */}
        <div className="w-full flex flex-row flex-wrap mx-auto justify-center gap-8 mb-10">
          {data?.singletons.map((item: any, index: number) => {
            return (
              <BoxDashboard key={index} value={item.value} title={item.title} />
            );
          })}
        </div>

        {/* نمودار‌ها */}
        <div className="bg-[#EFEFEF80] rounded-lg shadow-md overflow-x-auto">
          <div className="flex min-w-[768px]">
            {data?.charts.map((chart: any, index: number) => (
              <LineChart
                key={index}
                chartTitle={chart.chartTitle}
                chartData={chart.series}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
