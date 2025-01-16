"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Triangle } from "react-loader-spinner";
import {
  getMentorPatientGroups,
} from "@/utils/adminApi";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import Pagination from "@/components/Pagination"; // کامپوننت صفحه‌بندی

// مپ کردن مقادیر به فارسی
const organMap: { [key: string]: string } = {
  1: "تخمدان",
  2: "پستان",
  3: "پروستات",
};

const diseaseTypeMap: { [key: string]: string } = {
  1: "بدخیم",
  2: "خوش‌خیم",
};

export default function MentorPatientGroups() {

  // Fetch لیست گروه‌ها
  const { data: groupList, isLoading: isGroupLoading } = useQuery({
    queryKey: ["PatientGroupList"],
    queryFn: async () => {
      const data = await getMentorPatientGroups();
      return data;
    },
  });

  return (
    <div className="w-full min-h-screen p-6 flex flex-col items-center bg-[#f9f9f9] mt-20">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-md p-6">
        {/* هدر */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-primary-800">گروه‌های من</h2>
        </div>

        {/* جدول */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {/* <TableHead>ردیف</TableHead> */}
                <TableHead>عنوان</TableHead>
                <TableHead>ارگان</TableHead>
                <TableHead>نوع بیماری</TableHead>
                <TableHead>سطح بیماری</TableHead>
                {/* <TableHead>منتور</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isGroupLoading ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <div className="flex justify-center">
                      <Triangle
                        height="80"
                        width="80"
                        color="#4fa94d"
                        ariaLabel="triangle-loading"
                        visible={true}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                groupList?.map((group: any, index: number) => (
                  <TableRow key={group.id}>
                    {/* <TableCell>{pageSize * (page - 1) + (index + 1)}</TableCell> */}
                    <TableCell>{group.description}</TableCell>
                    <TableCell>
                      {organMap[group.organ] || group.organ}
                    </TableCell>
                    <TableCell>
                      {diseaseTypeMap[group.diseaseType] || group.diseaseType}
                    </TableCell>
                    <TableCell>{group.stage}</TableCell>
                    
                    {/* <TableCell>
                      {group.mentorName ? `${group.mentorName}` : "بدون منتور"}
                    </TableCell> */}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

      </div>
    </div>
  );
}
