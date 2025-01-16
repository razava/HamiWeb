"use client";

import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  GetAllQuestions,
  SubmitQuestion,
  UpdateQuestion,
  DeleteQuestion,
} from "@/utils/adminApi"; // API متدها
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

// داده‌های Enum برای TestType
const testTypeMap: { [key: string]: string } = {
  1: "اختلال اضطراب فراگیر (GAD)",
  2: "اختلال افسردگی عمده (MDD)",
  3: "ثبت مود روزانه (MOOD)",
};

// مقادیر پیش‌فرض فرم
const defaultQuestionValues = {
  testType: "GAD",
  questionText: "",
};

export default function AdminQuestions() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any | null>(null);
  const [questionForm, setQuestionForm] = useState(defaultQuestionValues);

  const [page, setPage] = useState(1); // شماره صفحه جاری
  const [totalPages, setTotalPages] = useState(1); // تعداد کل صفحات
  const [totalCount, setTotalCount] = useState(0); // تعداد کل آیتم‌ها
  const pageSize = 10; // تعداد آیتم‌ها در هر صفحه

  // Fetch لیست پرسش‌ها
  const {
    data: questionList,
    isLoading: isQuestionLoading,
    refetch: refetchQuestions,
  } = useQuery({
    queryKey: ["QuestionList", page],
    queryFn: async () => {
      const data = await GetAllQuestions({
        PageNumber: page,
        PageSize: pageSize,
      });
      const pagination = JSON.parse(data.headers["x-pagination"]);
      setTotalPages(pagination.TotalPages);
      setTotalCount(pagination.TotalCount);
      return data;
    },
  });

  // Mutation: افزودن پرسش
  const addQuestionMutation = useMutation({
    mutationFn: SubmitQuestion,
    onSuccess: () => {
      toast.success("پرسش با موفقیت اضافه شد!");
      queryClient.invalidateQueries({ queryKey: ["QuestionList"] });
      setIsDialogOpen(false);
      setQuestionForm(defaultQuestionValues);
    },
    onError: () => {
      toast.error("خطایی در افزودن پرسش رخ داد.");
    },
  });

  // Mutation: ویرایش پرسش
  const updateQuestionMutation = useMutation({
    mutationFn: UpdateQuestion,
    onSuccess: () => {
      toast.success("پرسش با موفقیت ویرایش شد!");
      queryClient.invalidateQueries({ queryKey: ["QuestionList"] });
      setIsDialogOpen(false);
      setEditingQuestion(null);
      setQuestionForm(defaultQuestionValues);
    },
    onError: () => {
      toast.error("خطایی در ویرایش پرسش رخ داد.");
    },
  });

  // Mutation: حذف یا غیر فعال کردن پرسش
  const deleteQuestionMutation = useMutation({
    mutationFn: DeleteQuestion,
    onSuccess: () => {
      toast.success("پرسش با موفقیت حذف شد!");
      queryClient.invalidateQueries({ queryKey: ["QuestionList"] });
    },
    onError: () => {
      toast.error("خطایی در حذف پرسش رخ داد.");
    },
  });

  // هندل کردن باز کردن فرم ویرایش
  const handleEditQuestion = (question: any) => {
    setEditingQuestion(question);
    setQuestionForm({
      testType: String(question.testType),
      questionText: question.questionText,
    });
    setIsDialogOpen(true);
  };

  // هندل کردن حذف
  const handleDeleteQuestion = (questionId: string) => {
    deleteQuestionMutation.mutate({ id: questionId });
  };

  // ارسال فرم
  const handleSubmit = () => {
    const formData = {
      testType: questionForm.testType,
      questionText: questionForm.questionText,
    };

    if (editingQuestion) {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("testType", formData.testType);
      formDataToSubmit.append("questionText", formData.questionText);

      updateQuestionMutation.mutate({
        id: editingQuestion.id,
        payload: formDataToSubmit,
      });
    } else {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("testType", formData.testType);
      formDataToSubmit.append("questionText", formData.questionText);
      addQuestionMutation.mutate(formDataToSubmit);
    }
  };

  return (
    <div className="w-full min-h-screen p-6 flex flex-col items-center bg-[#f9f9f9] mt-20">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-md p-6">
        {/* هدر */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-primary-800">مدیریت پرسش‌ها</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="flex items-center bg-green-600 text-white hover:bg-green-700 rounded-full px-4 py-2 shadow-lg"
                onClick={() => {
                  setQuestionForm(defaultQuestionValues);
                  setEditingQuestion(null);
                  setIsDialogOpen(true);
                }}
              >
                <Plus className="w-5 h-5 mr-2" />
                افزودن پرسش
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingQuestion ? "ویرایش پرسش" : "افزودن پرسش"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4">
                {/* نوع تست */}
                {!editingQuestion && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      نوع تست:
                    </label>
                    <Select
                      onValueChange={(value) =>
                        setQuestionForm({
                          ...questionForm,
                          testType: value,
                        })
                      }
                      value={questionForm.testType || ""}
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
                )}
                {/* متن پرسش */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    متن پرسش:
                  </label>
                  <Input
                    value={questionForm.questionText}
                    onChange={(e) =>
                      setQuestionForm({
                        ...questionForm,
                        questionText: e.target.value,
                      })
                    }
                    placeholder="متن پرسش را وارد کنید"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleSubmit}
                  className="bg-green-500 text-white hover:bg-green-600"
                >
                  {editingQuestion ? "ذخیره " : "افزودن"}
                </Button>
                <Button
                  onClick={() => {
                    setQuestionForm(defaultQuestionValues);
                    setEditingQuestion(null);
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
                <TableHead>متن پرسش</TableHead>
                <TableHead>عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isQuestionLoading ? (
                <TableRow>
                  <TableCell colSpan={4}>
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
                questionList?.data?.map((question: any, index: number) => (
                  <TableRow key={question.id}>
                    <TableCell>{pageSize * (page - 1) + (index + 1)}</TableCell>
                    <TableCell>
                      {testTypeMap[question.testType] || question.testType}
                    </TableCell>
                    <TableCell>{question.questionText}</TableCell>
                    <TableCell>
                      <div className="flex justify-center space-x-2 rtl:space-x-reverse">
                        <button
                          className="p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                          onClick={() => handleEditQuestion(question)}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                          onClick={() => handleDeleteQuestion(question.id)}
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
