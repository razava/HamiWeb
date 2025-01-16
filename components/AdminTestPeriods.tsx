"use client";

import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { convertDate } from "@/lib/utils"; // تبدیل تاریخ میلادی به شمسی
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

import { toast } from "sonner";
import moment from "jalali-moment";
import {
  GetAllTestPeriods,
  SubmitTestPeriod,
  UpdateTestPeriod,
  DeleteTestPeriod,
} from "@/utils/adminApi";
import { Triangle } from "react-loader-spinner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";

import { Pencil, Trash, Plus } from "lucide-react"; // آیکون‌ها
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import Pagination from "@/components/Pagination"; // فرض بر این است که کامپوننت Pagination شما موجود است
import { FormControl } from "@/components/ui/form"; // فرض بر این است که کامپوننت FormControl شما موجود است
import { Input } from "@/components/ui/input"; // فرض بر این است که کامپوننت Input شما موجود است
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"; // فرض بر این است که کامپوننت Select شما موجود است

const defaultTestPeriodValues = {
  testType: "",
  periodName: "",
  startDate: "",
  endDate: "",
  code: "",
};

// داده‌های Enum برای TestType
const testTypeMap: { [key: string]: string } = {
  1: "اختلال اضطراب فراگیر (GAD)",
  2: "اختلال افسردگی عمده (MDD)",
  3: "ثبت مود روزانه (MOOD)",
};

export default function AdminTestPeriods() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTestPeriod, setEditingTestPeriod] = useState<any | null>(null);
  const [testPeriodForm, setTestPeriodForm] = useState(defaultTestPeriodValues);

  const [page, setPage] = useState(1); // شماره صفحه جاری
  const [totalPages, setTotalPages] = useState(1); // تعداد کل صفحات
  const [totalCount, setTotalCount] = useState(0); // تعداد کل آیتم‌ها
  const pageSize = 10; // تعداد آیتم‌ها در هر صفحه

  // Fetch لیست TestPeriod‌ها
  const {
    data: testPeriodList,
    isLoading: isTestPeriodLoading,
    refetch: refetchTestPeriods,
  } = useQuery({
    queryKey: ["TestPeriodList", page],
    queryFn: async () => {
      const data = await GetAllTestPeriods({
        PageNumber: page,
        PageSize: pageSize,
      });
      const pagination = JSON.parse(data.headers["x-pagination"]);
      setTotalPages(pagination.TotalPages);
      setTotalCount(pagination.TotalCount);
      return data;
    },
  });

  // Mutation: افزودن TestPeriod
  const addTestPeriodMutation = useMutation({
    mutationFn: SubmitTestPeriod,
    onSuccess: () => {
      toast.success("دوره تست با موفقیت اضافه شد!");
      queryClient.invalidateQueries({ queryKey: ["TestPeriodList"] });
      setIsDialogOpen(false);
      setTestPeriodForm(defaultTestPeriodValues);
    },
    onError: () => {
      toast.error("خطایی در افزودن دوره تست رخ داد.");
    },
  });

  // Mutation: ویرایش TestPeriod
  const updateTestPeriodMutation = useMutation({
    mutationFn: UpdateTestPeriod,
    onSuccess: () => {
      toast.success("دوره تست با موفقیت ویرایش شد!");
      queryClient.invalidateQueries({ queryKey: ["TestPeriodList"] });
      setIsDialogOpen(false);
      setEditingTestPeriod(null);
      setTestPeriodForm(defaultTestPeriodValues);
    },
    onError: () => {
      toast.error("خطایی در ویرایش دوره تست رخ داد.");
    },
  });

  // Mutation: حذف TestPeriod
  const deleteTestPeriodMutation = useMutation({
    mutationFn: DeleteTestPeriod,
    onSuccess: () => {
      toast.success("دوره تست با موفقیت حذف شد!");
      queryClient.invalidateQueries({ queryKey: ["TestPeriodList"] });
    },
    onError: () => {
      toast.error("خطایی در حذف دوره تست رخ داد.");
    },
  });

  // هندل کردن باز کردن فرم ویرایش
  const handleEditTestPeriod = (testPeriod: any) => {
    setEditingTestPeriod(testPeriod);
    setTestPeriodForm({
      testType: String(testPeriod.testType), // نوع تست (به صورت رشته)
      periodName: testPeriod.periodName, // نام دوره
      startDate: moment(testPeriod.startDate).format("jYYYY/jMM/jDD"), // تبدیل تاریخ شروع به شمسی
      endDate: moment(testPeriod.endDate).format("jYYYY/jMM/jDD"), // تبدیل تاریخ پایان به شمسی
      code: testPeriod.code, // کد دوره
    });
    setIsDialogOpen(true);
  };

  // هندل کردن حذف
  const handleDeleteTestPeriod = (testPeriodId: string) => {
    deleteTestPeriodMutation.mutate({ id: testPeriodId });
  };

  // ارسال فرم
  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("testType", testPeriodForm.testType);
    formData.append("periodName", testPeriodForm.periodName);
    formData.append(
      "startDate",
      moment
        .from(testPeriodForm.startDate, "jYYYY/jMM/jDD")
        .format("YYYY-MM-DD")
    );
    formData.append(
      "endDate",
      moment.from(testPeriodForm.endDate, "jYYYY/jMM/jDD").format("YYYY-MM-DD")
    );
    formData.append("code", testPeriodForm.code);

    if (editingTestPeriod) {
      // ویرایش
      updateTestPeriodMutation.mutate({
        id: editingTestPeriod.id,
        payload: formData,
      });
    } else {
      // افزودن
      addTestPeriodMutation.mutate(formData);
    }
  };

  const handleDateChange = (type: "startDate" | "endDate", date: any) => {
    if (
      type === "endDate" &&
      moment(date.toDate()).isBefore(testPeriodForm.startDate)
    ) {
      toast.error("تاریخ پایان نمی‌تواند قبل از تاریخ شروع باشد.");
      return;
    }

    setTestPeriodForm({
      ...testPeriodForm,
      [type]: date ? moment(date.toDate()).format("jYYYY/jMM/jDD") : "",
    });
  };

  return (
    <div className="w-full min-h-screen p-6 flex flex-col items-center bg-[#f9f9f9] mt-20">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-md p-6">
        {/* هدر */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-primary-800">
            مدیریت آزمون ها
          </h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="flex items-center bg-green-600 text-white hover:bg-green-700 rounded-full px-4 py-2 shadow-lg"
                onClick={() => {
                  setTestPeriodForm(defaultTestPeriodValues);
                  setEditingTestPeriod(null);
                  setIsDialogOpen(true);
                }}
              >
                <Plus className="w-5 h-5 mr-2" />
                افزودن دوره
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingTestPeriod ? "ویرایش دوره تست" : "افزودن دوره تست"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4">
                {/* نوع تست */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    نوع تست:
                  </label>
                  <Select
                    onValueChange={(value) =>
                      setTestPeriodForm({ ...testPeriodForm, testType: value })
                    }
                    value={testPeriodForm.testType || ""}
                  >
                    <SelectTrigger className="w-full text-right">
                      <SelectValue placeholder="نوع تست را انتخاب کنید" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(testTypeMap)
                        .filter(([key]) => key !== "3") // حذف مقدار تست مود (3)
                        .map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            {value}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* نام دوره */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    نام دوره:
                  </label>
                  <Input
                    value={testPeriodForm.periodName}
                    onChange={(e) =>
                      setTestPeriodForm({
                        ...testPeriodForm,
                        periodName: e.target.value,
                      })
                    }
                    placeholder="نام دوره"
                  />
                </div>

                {/* تاریخ شروع */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    تاریخ شروع:
                  </label>
                  <DatePicker
                    calendar={persian} // تقویم شمسی
                    locale={persian_fa} // زبان فارسی
                    className="w-full p-2 border border-blue/30 rounded-md text-sm"
                    containerClassName="w-full"
                    inputClass="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    value={
                      testPeriodForm.startDate ? testPeriodForm.startDate : null
                    } // مقدار پیش‌فرض
                    onChange={(date) =>
                      setTestPeriodForm({
                        ...testPeriodForm,
                        startDate: date
                          ? moment(date.toDate()).format("jYYYY/jMM/jDD")
                          : "",
                      })
                    }
                  />
                </div>

                {/* تاریخ پایان */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    تاریخ پایان:
                  </label>
                  <DatePicker
                    calendar={persian} // تقویم شمسی
                    locale={persian_fa} // زبان فارسی
                    className="w-full p-2 border border-blue/30 rounded-md text-sm"
                    containerClassName="w-full"
                    inputClass="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    value={
                      testPeriodForm.endDate ? testPeriodForm.endDate : null
                    } // مقدار پیش‌فرض
                    onChange={(date) => handleDateChange("endDate", date)}
                  />
                </div>

                {/* کد دوره */}
                {!editingTestPeriod && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      کد دوره:
                    </label>
                    <Input
                      type="number"
                      value={testPeriodForm.code}
                      onChange={(e) =>
                        setTestPeriodForm({
                          ...testPeriodForm,
                          code: e.target.value,
                        })
                      }
                    />
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button
                  onClick={handleSubmit}
                  className="bg-green-500 text-white hover:bg-green-600"
                >
                  {editingTestPeriod ? "ذخیره تغییرات" : "افزودن"}
                </Button>
                <Button
                  onClick={() => {
                    setTestPeriodForm(defaultTestPeriodValues);
                    setEditingTestPeriod(null);
                    setIsDialogOpen(false);
                  }}
                  variant="outline"
                >
                  انصراف
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* جدول */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ردیف</TableHead>
                <TableHead>نوع تست</TableHead>
                <TableHead>نام دوره</TableHead>
                <TableHead>تاریخ شروع</TableHead>
                <TableHead>تاریخ پایان</TableHead>
                <TableHead>کد دوره</TableHead>
                <TableHead>عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isTestPeriodLoading ? (
                <TableRow>
                  <TableCell colSpan={7}>
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
                testPeriodList?.data?.map((testPeriod: any, index: number) => (
                  <TableRow key={testPeriod.id}>
                    <TableCell>{pageSize * (page - 1) + (index + 1)}</TableCell>
                    <TableCell>
                      {testTypeMap[testPeriod.testType] || testPeriod.testType}
                    </TableCell>
                    <TableCell>{testPeriod.periodName}</TableCell>
                    <TableCell>
                      {convertDate(testPeriod.startDate)}{" "}
                      {/* تبدیل تاریخ به شمسی */}
                    </TableCell>
                    <TableCell>
                      {convertDate(testPeriod.endDate)}{" "}
                      {/* تبدیل تاریخ به شمسی */}
                    </TableCell>
                    <TableCell>{testPeriod.code}</TableCell>
                    <TableCell>
                      <div className="flex justify-center space-x-2 rtl:space-x-reverse">
                        <button
                          className="p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                          onClick={() => handleEditTestPeriod(testPeriod)}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                          onClick={() => handleDeleteTestPeriod(testPeriod.id)}
                        >
                          <Trash className="w-4 h-4" />
                        </button>
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
