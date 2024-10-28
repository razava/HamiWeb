"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LineChart from "./LineChart";

import { BsBarChartLineFill } from "react-icons/bs";
import { BsBarChartLine } from "react-icons/bs";
import VerticalChart from "./VerticalChart";
import { HorizontalChart } from "./HorizontalChart";
import { getInfo, getInfoList } from "@/utils/infoApi";
import { useQueries, useQuery } from "@tanstack/react-query";

export default function Reports({ data }: { data: any }) {
  const Queries: any = useQueries({
    queries: data?.map((item: any) => ({
      queryKey: ["user", item.code],
      queryFn: () => getInfo(item.code),
    })),
  });

  const codes = data.map((item: any) => item.code);
  const charts = Queries.map((item: any) => item.data);
  const successfulRequests = Queries.filter(
    (item: any) => item.isSuccess == true
  );
  
  return (
    <div className="">
      {successfulRequests.length == data.length && (
        <Tabs
          defaultValue={data[0].code}
          className="w-full flex flex-col md:flex-row gap-12 items-center"
          dir="rtl"
        >
          <div className="w-full md:w-2/5 flex flex-col justify-between items-center ">
            {/* Tab Title  */}
            <TabsList className="w-full h-full flex  flex-row md:flex-col max-md:flex-wrap max-md:justify-between bg-transparent gap-4">
              {data?.map((item: any) => {
                return (
                  <TabsTrigger
                    key={item.code}
                    className="w-[45%] md:w-full  h-12  bg-muted text-[#555353] shadow-md hover:shadow-none text-xs lg:text-sm font-bold py-3 gap-2 justify-center whitespace-pre-line"
                    value={item.code}
                  >
                    {item.title}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          <div className="w-full md:w-3/5 flex  justify-between items-center ">
            {charts?.map((item: any, index: number) => {
              return (
                <TabsContent
                  key={index}
                  value={codes[index]}
                  className="w-full"
                >
                  <VerticalChart
                    chartTitle={item.charts[0].chartTitle}
                    chartData={item.charts[0].series}
                    chart={2}
                  />
                </TabsContent>
              );
            })}
          </div>
        </Tabs>
      )}
    </div>
  );
}
