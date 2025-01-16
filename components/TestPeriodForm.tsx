"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getTestQuestions, SubmitTestPeriodResult } from "@/utils/adminApi";
import { Triangle } from "react-loader-spinner";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";


// تعریف نوع پاسخ‌ها
type Answer = {
  questionId: string;
  score: number;
};

export default function TestPeriodForm({
  testPeriodId
}: {
  testPeriodId: string;
}) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Answer[]>([]); // استفاده از نوع تعریف شده برای answers

  const searchParams = useSearchParams();
  const testType = searchParams.get("testType"); // گرفتن testType از query string

  // گرفتن سوالات آزمون
  const { data: questions, isLoading } = useQuery({
    queryKey: ["TestQuestions", testPeriodId],
    queryFn: () => getTestQuestions(testPeriodId),
    refetchOnWindowFocus: false,
  });

  // Mutation ثبت نتیجه آزمون
  const mutation = useMutation({
    mutationFn: (formData: FormData) => SubmitTestPeriodResult(formData),
    onSuccess: () => {
      toast.success("آزمون با موفقیت ثبت شد!");
      router.back();
    },
    onError: (error) => {
      toast.error(
        "خطا در ثبت آزمون: " +
          (error as any).response?.data?.message ||
          error.message
      );
    },
  });

  // هندل تغییر پاسخ سوالات
  const handleAnswerChange = (questionId: string, score: number) => {
    setAnswers((prev) => {
      const updated = [...prev];
      const index = updated.findIndex((a) => a.questionId === questionId);
      if (index !== -1) {
        updated[index].score = score;
      } else {
        updated.push({ questionId, score });
      }
      return updated;
    });
  };

  // ارسال آزمون
  const handleSubmit = () => {
    if (answers.length !== questions.length) {
      toast.warning("لطفاً به تمام سوالات پاسخ دهید.");
      return;
    }

    // محاسبه مجموع امتیازات
    const totalScore = answers.reduce((sum, answer) => sum + answer.score, 0);

    // ساخت FormData
    const formData = new FormData();
    formData.append("userId", ""); 
    formData.append("testType", testType || ""); 
    formData.append("testPeriodId", testPeriodId); // افزودن شناسه دوره آزمون
    formData.append("totalScore", String(totalScore)); // افزودن مجموع امتیازات

    mutation.mutate(formData); // ارسال داده‌ها
  };

  return (
    <div className="w-[95vw] lg:w-[80vw] xl:w-[70vw] mx-auto mt-12">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Triangle visible={true} height={100} width={100} color="#003778" />
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-bold mb-6 text-center">
          در طی دو هفته گذشته، چه میزان مشکلات (موارد) زیر برای شما آزار دهنده بوده است؟ (برای شما اتفاق افتاده است)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-xs text-right text-gray-500 border border-gray-300 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="w-[65%] px-4 py-2">
                    سوال
                  </th>
                  <th scope="col" className="w-[8.75%] px-4 py-2 text-center">
                    هیچ وقت (۰)
                  </th>
                  <th scope="col" className="w-[8.75%] px-4 py-2 text-center">
                    بعضی از روزها (۱)
                  </th>
                  <th scope="col" className="w-[8.75%] px-4 py-2 text-center">
                    بیشتر از نیمی از ایام (۲)
                  </th>
                  <th scope="col" className="w-[8.75%] px-4 py-2 text-center">
                    تقریبا هر روز (۳)
                  </th>
                </tr>
              </thead>
              <tbody>
                {questions.map(
                  (q: { id: string; questionText: string }, index: number) => (
                    <tr
                      key={q.id}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                    >
                      {/* ستون پرسش */}
                      <td className="w-[65%] px-4 py-2 font-medium text-gray-900 dark:text-white break-words align-middle">
                        {index + 1}. {q.questionText}
                      </td>

                      {/* ستون پاسخ‌ها */}
                      {[0, 1, 2, 3].map((value) => (
                        <td
                          key={value}
                          className="w-[8.75%] px-4 py-2 align-middle text-center"
                        >
                          <input
                            type="radio"
                            name={`question-${q.id}`}
                            value={value}
                            onChange={() => handleAnswerChange(q.id, value)}
                            className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                      ))}
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end gap-4 mt-6">
           

            {/* دکمه ثبت آزمون */}
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded"
            >
              ثبت آزمون
            </button>

             {/* دکمه بازگشت */}
             <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded"
            >
              بازگشت
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
