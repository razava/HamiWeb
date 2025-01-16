"use client";

import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  GetAllTestPeriodResults,
  SubmitTestPeriodResult,
  UpdateTestPeriodResult,
  DeleteTestPeriodResult,
  getPatientsList,
  GetAllTestPeriods,
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

import Pagination from "@/components/Pagination";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const defaultResultValues = {
  userId: "",
  testType: "GAD",
  totalScore: 0,
  testPeriodId: "",
};

// تبدیل تاریخ به شمسی
const convertDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fa-IR");
};

const testTypeMap: { [key: string]: string } = {
  1: "اختلال اضطراب فراگیر (GAD)",
  2: "اختلال افسردگی عمده (MDD)",
  3: "ثبت مود روزانه (MOOD)",
};

export default function AdminTestPeriodResults() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<any | null>(null);
  const [resultForm, setResultForm] = useState(defaultResultValues);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  // Fetch لیست نتایج دوره تست
  const {
    data: resultList,
    isLoading: isResultLoading,
    refetch: refetchResults,
  } = useQuery({
    queryKey: ["TestPeriodResultList", page],
    queryFn: async () => {
      const data = await GetAllTestPeriodResults({
        PageNumber: page,
        PageSize: pageSize,
      });
      const pagination = JSON.parse(data.headers["x-pagination"]);
      setTotalPages(pagination.TotalPages);
      setTotalCount(pagination.TotalCount);
      return data;
    },
  });

  const { data: patientList, isLoading: isLoadingPatientList } = useQuery({
    queryKey: ["PatientsList"],
    queryFn: () => getPatientsList({ Status: 2 }),
    refetchOnWindowFocus: false,
  });

  const { data: periodList, isLoading: isLoadingPeriodList } = useQuery({
    queryKey: ["TestPeriodList"],
    queryFn: () =>
      GetAllTestPeriods({
        PageNumber: 1,
        PageSize: 100,
      }),
    refetchOnWindowFocus: false,
  });

  // Mutation: افزودن نتیجه
  const addResultMutation = useMutation({
    mutationFn: SubmitTestPeriodResult,
    onSuccess: () => {
      toast.success("نتیجه با موفقیت اضافه شد!");
      queryClient.invalidateQueries({ queryKey: ["TestPeriodResultList"] });
      setIsDialogOpen(false);
      setResultForm(defaultResultValues);
    },
    onError: () => {
      toast.error("خطایی در افزودن نتیجه رخ داد.");
    },
  });

  // Mutation: ویرایش نتیجه
  const updateResultMutation = useMutation({
    mutationFn: UpdateTestPeriodResult,
    onSuccess: () => {
      toast.success("نتیجه با موفقیت ویرایش شد!");
      queryClient.invalidateQueries({ queryKey: ["TestPeriodResultList"] });
      setIsDialogOpen(false);
      setEditingResult(null);
      setResultForm(defaultResultValues);
    },
    onError: () => {
      toast.error("خطایی در ویرایش نتیجه رخ داد.");
    },
  });

  // Mutation: حذف نتیجه
  const deleteResultMutation = useMutation({
    mutationFn: DeleteTestPeriodResult,
    onSuccess: () => {
      toast.success("نتیجه با موفقیت حذف شد!");
      queryClient.invalidateQueries({ queryKey: ["TestPeriodResultList"] });
    },
    onError: () => {
      toast.error("خطایی در حذف نتیجه رخ داد.");
    },
  });

  // هندل کردن باز کردن فرم ویرایش
  const handleEditResult = (result: any) => {
    setEditingResult(result);
    setResultForm({
      userId: result.userId,
      testType: String(result.testType),
      totalScore: result.totalScore,
      testPeriodId: result.testPeriodId,
    });
    setIsDialogOpen(true);
  };

  // هندل کردن حذف
  const handleDeleteResult = (resultId: string) => {
    deleteResultMutation.mutate({ id: resultId });
  };

  // ارسال فرم
  const handleSubmit = () => {
    const formData = {
      userId: resultForm.userId,
      testType: resultForm.testType,
      totalScore: resultForm.totalScore,
      testPeriodId: resultForm.testPeriodId,
    };

    if (editingResult) {
      const formDataInstance = new FormData();
      formDataInstance.append("userId", formData.userId);
      formDataInstance.append("testType", formData.testType);
      formDataInstance.append("totalScore", formData.totalScore.toString());
      formDataInstance.append("testPeriodId", formData.testPeriodId);

      updateResultMutation.mutate({
        id: editingResult.id,
        payload: formDataInstance,
      });
    } else {
      const formDataInstance = new FormData();
      formDataInstance.append("userId", formData.userId);
      formDataInstance.append("testType", formData.testType);
      formDataInstance.append("totalScore", formData.totalScore.toString());
      formDataInstance.append("testPeriodId", formData.testPeriodId);

      addResultMutation.mutate(formDataInstance);
    }
  };

  return (
    <div className="w-full min-h-screen p-6 flex flex-col items-center bg-[#f9f9f9] mt-20">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-md p-6">
        {/* هدر */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-primary-800">
            مدیریت نتایج دوره‌های تست
          </h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              {/* <Button className="flex items-center bg-green-600 text-white hover:bg-green-700 rounded-full px-4 py-2 shadow-lg">
                <Plus className="w-5 h-5 mr-2" />
                افزودن نتیجه
              </Button> */}
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingResult ? "ویرایش نتیجه" : "افزودن نتیجه"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4">
                {/* کاربر */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    شناسه کاربر:
                  </label>
                  <Input
                    value={resultForm.userId}
                    onChange={(e) =>
                      setResultForm({
                        ...resultForm,
                        userId: e.target.value,
                      })
                    }
                    placeholder="شناسه کاربر را وارد کنید"
                  />
                </div>
                {/* نوع تست */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    نوع تست:
                  </label>
                  <Select
                    onValueChange={(value) =>
                      setResultForm({ ...resultForm, testType: value })
                    }
                    value={resultForm.testType || ""}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="نوع تست را انتخاب کنید" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(testTypeMap).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* امتیاز کل */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    امتیاز کل:
                  </label>
                  <Input
                    type="number"
                    value={resultForm.totalScore}
                    onChange={(e) =>
                      setResultForm({
                        ...resultForm,
                        totalScore: Number(e.target.value),
                      })
                    }
                    placeholder="امتیاز کل را وارد کنید"
                  />
                </div>
                {/* شناسه دوره تست */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    شناسه دوره تست:
                  </label>
                  <Input
                    value={resultForm.testPeriodId}
                    onChange={(e) =>
                      setResultForm({
                        ...resultForm,
                        testPeriodId: e.target.value,
                      })
                    }
                    placeholder="شناسه دوره تست را وارد کنید"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleSubmit}
                  className="bg-green-500 text-white hover:bg-green-600"
                >
                  {editingResult ? "ذخیره تغییرات" : "افزودن"}
                </Button>
                <Button
                  onClick={() => {
                    setResultForm(defaultResultValues);
                    setEditingResult(null);
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
                <TableHead>نام دوره آزمون</TableHead>
                <TableHead>نام کاربر</TableHead>
                <TableHead>امتیاز کل</TableHead>
                <TableHead>تاریخ ثبت امتیاز</TableHead>
                {/* <TableHead>عملیات</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isResultLoading ? (
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
                resultList?.data?.map((result: any, index: number) => (
                  <TableRow key={result.id}>
                    <TableCell>{pageSize * (page - 1) + (index + 1)}</TableCell>

                    <TableCell>
                      {testTypeMap[result.testType] || result.testType}
                    </TableCell>
                    <TableCell>{result.testPeriodName}</TableCell>
                    <TableCell>{result.username}</TableCell>
                    <TableCell>{result.totalScore}</TableCell>
                    <TableCell>
                      {convertDate(result.createdAt)}{" "}
                      {/* تبدیل تاریخ به شمسی */}
                    </TableCell>
                    {/* <TableCell>
                      <div className="flex justify-center space-x-2 rtl:space-x-reverse">
                        <button
                          className="p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                          onClick={() => handleEditResult(result)}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                          onClick={() => handleDeleteResult(result.id)}
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </TableCell> */}
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
