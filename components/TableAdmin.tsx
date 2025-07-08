"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getMentorsList, DeleteUser } from "@/utils/adminApi";
import { Button } from "@/components/ui/button";
import { Pencil, Trash, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import Pagination from "@/components/Pagination";

const pageSize = 10; // تعداد آیتم‌ها در هر صفحه

// تبدیل جنسیت به متن
const getGenderText = (gender: number) => {
  switch (gender) {
    case 1:
      return "مرد";
    case 2:
      return "زن";
    case 3:
      return "سایر";
    default:
      return "نامشخص";
  }
};

// تبدیل تحصیلات به متن
const getEducationText = (education: number) => {
  switch (education) {
    case 0:
      return "بدون تحصیلات";
    case 1:
      return "دیپلم";
    case 2:
      return "لیسانس";
    case 3:
      return "فوق لیسانس";
    case 4:
      return "دکتری";
    case 5:
      return "سایر";
    default:
      return "نامشخص";
  }
};

export default function AdminMentors() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch لیست منتورها
  const {
    data: mentorList,
    isLoading: isMentorLoading,
    refetch: refetchMentors,
  } = useQuery({
    queryKey: ["MentorList", page],
    queryFn: async () => {
      const data = await getMentorsList({
        PageNumber: page,
        PageSize: pageSize,
      });
      const pagination = JSON.parse(data.headers["x-pagination"]);
      setTotalPages(pagination.TotalPages);
      setTotalCount(pagination.TotalCount);
      return data;
    },
  });

  // Mutation: حذف منتور
  const deleteMentorMutation = useMutation({
    mutationFn: DeleteUser,
    onSuccess: () => {
      toast.success("منتور با موفقیت حذف شد!");
      queryClient.invalidateQueries({ queryKey: ["MentorList"] });
    },
    onError: () => {
      toast.error("خطایی در حذف منتور رخ داد.");
    },
  });

  // هندل کردن حذف
  const handleDeleteMentor = (mentorId: string) => {
    deleteMentorMutation.mutate({ id: mentorId });
  };

  return (
    <div className="w-full min-h-screen p-6 flex flex-col items-center bg-[#f9f9f9] mt-20">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-md p-6">
        {/* هدر */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-primary-800">مدیریت منتورها</h2>
          {/* دکمه برای افزودن منتور جدید */}
          <Button
            onClick={() => router.push(`/UserPanel/AdminDashboard/UserManagement/0`)}
            className="flex items-center bg-green-600 text-white hover:bg-green-700 rounded-full px-4 py-2 shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            افزودن منتور جدید
          </Button>
        </div>

        {/* جدول */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ردیف</TableHead>
                <TableHead>نام کاربری</TableHead>
                <TableHead>نام</TableHead>
                <TableHead>نام خانوادگی</TableHead>
                <TableHead>ایمیل</TableHead>
                <TableHead>شماره تماس</TableHead>
                <TableHead>شهر</TableHead>
                <TableHead>جنسیت</TableHead>
                <TableHead>تحصیلات</TableHead>
                <TableHead>عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isMentorLoading ? (
                <TableRow>
                  <TableCell colSpan={10}>در حال بارگذاری...</TableCell>
                </TableRow>
              ) : (
                mentorList?.data?.map((mentor: any, index: number) => (
                  <TableRow key={mentor.id}>
                    <TableCell>{pageSize * (page - 1) + (index + 1)}</TableCell>
                    <TableCell>{mentor.userName}</TableCell>
                    <TableCell>{mentor.firstName}</TableCell>
                    <TableCell>{mentor.lastName}</TableCell>
                    <TableCell>{mentor.email}</TableCell>
                    <TableCell>{mentor.phoneNumber}</TableCell>
                    <TableCell>{mentor.city}</TableCell>
                    <TableCell>{getGenderText(mentor.gender)}</TableCell> {/* تبدیل جنسیت */}
                    <TableCell>{getEducationText(mentor.educationLevel)}</TableCell> {/* تبدیل تحصیلات */}
                    <TableCell>
                      <div className="flex justify-center space-x-2 rtl:space-x-reverse">
                        <button
                          className="p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                          onClick={() => router.push(`/UserPanel/AdminDashboard/UserManagement/${mentor.id}`)}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        {/* <button
                          className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                          onClick={() => handleDeleteMentor(mentor.id)}
                        >
                          <Trash className="w-4 h-4" />
                        </button> */}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-center">
          <Pagination
            TotalPages={totalPages}
            currentPage={page - 1}
            PageSize={pageSize}
            countPage={totalCount}
            Page={(num: number) => setPage(num + 1)}
          />
        </div>
      </div>
    </div>
  );
}
