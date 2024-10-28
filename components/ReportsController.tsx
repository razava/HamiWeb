"use client";
import React, { useEffect, useState } from "react";
import { getInfo, getInfoList } from "@/utils/infoApi";
import { useQueries, useQuery } from "@tanstack/react-query";
import Reports from "./Reports";

export default function ReportsController() {
  const { data, isLoading, refetch, isSuccess } = useQuery({
    queryKey: ["InfoList"],
    queryFn: () => getInfoList(),
    refetchOnWindowFocus: false,
  });
  const [first, setfirst] = useState<any>(false);
  
  return (
    <div className="w-[95vw] lg:w-[82vw] xl:w-[75vw] 3xl:w-[65vw] max-sm:mt-16 mt-8 pt-9 mx-auto">
      {data && <Reports data={data} />}
    </div>
  );
}
