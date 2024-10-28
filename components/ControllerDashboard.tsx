"use client";
import React from "react";
import BoxDashboard from "./BoxDashboard";
import LineChart from "./LineChart";
import { useQuery } from "@tanstack/react-query";
import { getInfo } from "@/utils/infoApi";

export default function ControllerDashboard() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["Infos"],
    queryFn: () => getInfo(),
    refetchOnWindowFocus: false,
  });

  return (
    <div className="w-[95vw] lg:w-[82vw] xl:w-[70vw] 3xl:w-[65vw] mt-12 pt-9 mx-auto px-2">
      {/* Lg Show */}
      <div className="w-full  mb-6 flex-col gap-0 flex">
        <div className="w-full flex flex-row flex-wrap mx-auto justify-center gap-8 mb-10">
          {data?.singletons.map((item: any, index: number) => {
            return (
              <BoxDashboard key={index} value={item.value} title={item.title} />
            );
          })}
        </div>

        {/* چارت‌ها */}
        <div className="bg-[#EFEFEF80] rounded-lg shadow-md overflow-x-auto">
          <div className="flex min-w-[768px]">
            {data?.charts.map((item: any, index: number) => {
              return (
                <LineChart
                  key={index}
                  chartTitle={item.chartTitle}
                  chartData={item.series}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
