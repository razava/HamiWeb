"use client";

import React, { useEffect, useState } from "react";
import TableController from "./TableController";
import Search from "./Search";
import { useQuery } from "@tanstack/react-query";
import { getPatientsList } from "@/utils/adminApi"; // تابع API برای دریافت لیست بیماران
import Pagination from "./Pagination";
import { Skeleton } from "./ui/skeleton";

export default function MentorPatientController() {
  const [search, setSearch] = useState<string>(""); // فیلتر جستجو
  const [page, setPage] = useState<number>(1); // شماره صفحه
  const [totalCount, setTotalCount] = useState<number>(0); // کل تعداد بیماران
  const [currentPage, setCurrentPage] = useState<number>(0); // صفحه فعلی
  const [pageSize, setPageSize] = useState<number>(0); // تعداد آیتم‌های هر صفحه
  const [totalPages, setTotalPages] = useState<number>(0); // کل صفحات

  // دریافت لیست بیماران فقط با وضعیت "تأیید‌شده"
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["MentorPatientsList", page, search],
    queryFn: () =>
      getPatientsList({
        Status: 2, // فقط تأیید‌شده‌ها
        UserName: search, // جستجو
        PageNumber: page,
      }),
    refetchOnWindowFocus: false,
  });

  // به‌روزرسانی مقادیر صفحه‌بندی
  useEffect(() => {
    if (data) {
      const headersData = JSON.parse(data.headers["x-pagination"]);
      setTotalCount(headersData.TotalCount);
      setTotalPages(headersData.TotalPages);
      setCurrentPage(headersData.CurrentPage);
      setPageSize(headersData.PageSize);
    }
  }, [data]);

  const handleSearch = () => {
    setPage(1); // بازگشت به صفحه اول در جستجو
    refetch();
  };

  const isZero = totalCount === 0; // بررسی خالی بودن لیست بیماران

  return (
    <div className="w-[95vw] lg:w-[82vw] xl:w-[70vw] 3xl:w-[65vw] mt-16 pt-9 mx-auto">
      <div>
        <div className="flex flex-col-reverse items-center justify-between w-full gap-4 mb-5 lg:flex-row lg:gap-2">
          {/* کامپوننت جستجو */}
          <Search
            value={search}
            changeValue={(data: any) => setSearch(data)}
            mode="controller"
            action={handleSearch}
            Cancel={() => setSearch("")}
          />
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-3">
            <Skeleton className="w-full h-12" />
            <Skeleton className="w-full h-12" />
            <Skeleton className="w-full h-12" />
          </div>
        ) : (
          <TableController
            data={data?.data || []}
            currentPage={currentPage}
            pageSize={pageSize}
            userRole="Mentor"
          />
        )}

        {/* صفحه‌بندی */}
        {!isZero ? (
          <Pagination
            TotalPages={totalPages}
            currentPage={currentPage - 1}
            countPage={totalCount}
            Page={(num: number) => setPage(num + 1)}
          />
        ) : (
          <p className="flex justify-center mx-auto mt-10 text-blue/50">
            لیستی برای نمایش وجود ندارد
          </p>
        )}
      </div>
    </div>
  );
}
