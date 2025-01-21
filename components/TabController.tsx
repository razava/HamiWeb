"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TableController from "./TableController";
import Search from "./Search";
import { useQuery } from "@tanstack/react-query";
import { getPatientsList } from "@/utils/adminApi"; // تابع API برای دریافت لیست بیماران
import Pagination from "./Pagination";
import { Skeleton } from "./ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMediaQuery } from "react-responsive";

export default function TabController() {
  const isMobile = useMediaQuery({ maxWidth: 768 }); // بررسی حالت موبایل

  const [search, setSearch] = useState<string>(""); // فیلتر جستجو
  const [page, setPage] = useState<number>(1); // شماره صفحه
  const [totalCount, setTotalCount] = useState<number>(0); // کل تعداد بیماران
  const [currentPage, setCurrentPage] = useState<number>(0); // صفحه فعلی
  const [pageSize, setPageSize] = useState<number>(0); // تعداد آیتم‌های هر صفحه
  const [totalPages, setTotalPages] = useState<number>(0); // کل صفحات
  const [selectedTab, setSelectedTab] = useState<string>("1"); // وضعیت پیش‌فرض: "منتظر تأیید"

  // داده‌های ثابت برای وضعیت‌ها
  const userStatuses = [
    { value: "1", title: "منتظر تأیید" },
    { value: "2", title: "تأیید‌شده" },
    { value: "3", title: "رد‌شده" },
  ];

  // بازیابی تب انتخاب‌شده از localStorage در بارگذاری اولیه
  useEffect(() => {
    const savedTab = localStorage.getItem("activeTab");
    if (savedTab) {
      setSelectedTab(savedTab); // تب فعال را تنظیم می‌کنیم
    }
  }, []);

  // دریافت لیست بیماران با فیلتر وضعیت
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["PatientsList", selectedTab, page, search],
    queryFn: () =>
      getPatientsList({
        Status: Number(selectedTab), // وضعیت انتخابی
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

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
    setPage(1);
    localStorage.setItem("activeTab", tab); // تب فعال را ذخیره می‌کنیم
    refetch();
  };

  const isZero = totalCount === 0; // بررسی خالی بودن لیست بیماران

  return (
    <div className="w-[95vw] lg:w-[82vw] xl:w-[70vw] 3xl:w-[65vw] mt-16 pt-9 mx-auto">
      {isMobile ? (
        <div>
          <Tabs value={selectedTab} className="" dir="rtl">
            {/* Dropdown برای وضعیت در موبایل */}
            <div className="flex flex-col-reverse items-center justify-between w-full gap-4 mb-5 lg:flex-row lg:gap-2">
              <Select
                value={selectedTab}
                onValueChange={(value) => handleTabChange(value)}
              >
                <SelectTrigger className="w-full h-12 bg-[#E9E9E9]" dir="rtl">
                  <SelectValue placeholder="انتخاب وضعیت" />
                </SelectTrigger>
                <SelectContent dir="rtl">
                  {userStatuses.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Search
                value={search}
                changeValue={(data: any) => setSearch(data)}
                mode="controller"
                action={handleSearch}
                Cancel={() => setSearch("")}
              />
            </div>

            <TabsContent value={selectedTab}>
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
                  userRole="Admin"
                />
              )}
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
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div>
          <Tabs value={selectedTab} className="" dir="rtl">
            <div className="flex flex-col-reverse items-center justify-between w-full gap-4 mb-5 lg:flex-row lg:gap-2">
              <TabsList className="flex w-full gap-1 lg:w-4/5 p-1 bg-gray-100 rounded-md shadow-md max-lg:flex-wrap">
                {userStatuses.map((item) => (
                  <TabsTrigger
                    key={item.value}
                    value={item.value}
                    className={`flex-1 h-8 px-4 py-1 text-sm font-medium ${
                      selectedTab === item.value
                        ? "bg-blue-100 text-blue-700"
                        : "bg-white"
                    }`}
                    onClick={() => handleTabChange(item.value)}
                  >
                    {item.title}
                  </TabsTrigger>
                ))}
              </TabsList>

              <Search
                value={search}
                changeValue={(data: any) => setSearch(data)}
                mode="controller"
                action={handleSearch}
                Cancel={() => setSearch("")}
              />
            </div>

            <TabsContent value={selectedTab}>
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
                  userRole="Admin"
                />
              )}
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
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
